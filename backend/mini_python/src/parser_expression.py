from typing import Callable

import parsy
import functools
from parsy import Parser

import ast_expression as expression
from ast_expression import Expression

# utils

ws = parsy.whitespace.optional()

# Parsing literals

int_parser = parsy.regex(r"-?\d+")
int_expression_parser = int_parser.map(int).map(expression.IntExpression)

float_parser = parsy.regex(r"-?\d+\.\d+")
float_expression_parser = float_parser.map(float).map(expression.FloatExpression)

escape_seq = parsy.string("\\\\").map(lambda _: "\\") | parsy.string("\\\"").map(lambda _: '"') | parsy.string(r"\n").map(lambda _: '\n')
any_character_except_quote_or_backslash = parsy.regex(r"[^\\\"]")
string_content_parser = escape_seq | any_character_except_quote_or_backslash
quoted_string_parser = parsy.string('"') >> string_content_parser.many().concat() << parsy.string('"')

str_expression_parser = quoted_string_parser.map(expression.StrExpression)

bool_expression_parser = parsy.regex("True|False").map(lambda s: s == "True").map(expression.BoolExpression)

identifier_parser = parsy.regex(r"[a-zA-Z_][a-zA-Z0-9_]*").map(expression.Identifier)


expression_parser = parsy.forward_declaration()

ors = {"or" : expression.Or}
ands = {"and" : expression.And}
comparisons = {
    "==" : expression.Eq,
    "!=" : expression.NotEq,
    "<" : expression.Lt,
    "<=" : expression.LtE,
    ">" : expression.Gt,
    ">=" : expression.GtE
}
sums = {
    "+" : expression.Add,
    "-" : expression.Sub
}
products = {
    "*" : expression.Mult,
    "/" : expression.Div,
    "//" : expression.FloorDiv,
    "%" : expression.Mod
}

def parse_binop(ops: dict[str, Callable[[Expression, Expression], Expression]], next_parser: Parser) -> Parser:

    def combine_expressions(expr1: Expression, op: str, expr2: Expression) -> Expression:
        return ops[op](expr1, expr2)
    
    def get_combiner(op: str, expr2: Expression) -> Callable[[Expression], Expression]:
        return lambda expr1: combine_expressions(expr1, op, expr2)
    
    def reduce_list(intital: Expression, combiners: list[Callable[[Expression], Expression]]) -> Expression:
        return functools.reduce(lambda a,f: f(a), combiners, intital)

    repeated_parser = parsy.seq(ws >> parsy.string_from(*ops.keys()) << ws, next_parser).combine(get_combiner).many()
    binop_parser = parsy.seq(next_parser, repeated_parser).combine(reduce_list)
    return binop_parser


or_parser = parsy.forward_declaration()
and_parser = parsy.forward_declaration()
not_parser = parsy.forward_declaration()
comparsion_parser = parsy.forward_declaration()
sum_parser = parsy.forward_declaration()
product_parser = parsy.forward_declaration()
function_call_parser = parsy.forward_declaration()
bracketed_parser = parsy.forward_declaration()
base_parser = bracketed_parser | float_expression_parser | int_expression_parser | str_expression_parser | bool_expression_parser | identifier_parser

# precendence: 0
or_parser.become(parse_binop(ors, and_parser))
# precedence: 1
and_parser.become(parse_binop(ands, not_parser))
# precedence: 2
not_parser.become((parsy.string("not") >> ws >> not_parser).map(expression.Not) | comparsion_parser)
# precedence: 3
comparsion_parser.become(parse_binop(comparisons, sum_parser))
# precedence: 4
sum_parser.become(parse_binop(sums, product_parser))
# precedence: 5
product_parser.become(parse_binop(products, function_call_parser))



function_arg_sep = ws << parsy.string(",") << ws
arglist_parser = parsy.string("(") >> ws >> expression_parser.sep_by(function_arg_sep) << ws << parsy.string(")")
def combine_into_function_call_expression(func: Expression, arglists: list[list[Expression]]):
    return functools.reduce(expression.FunctionCall, arglists, func)
function_call_parser.become(parsy.seq(base_parser, arglist_parser.many()).combine(combine_into_function_call_expression))

bracketed_parser.become(parsy.string("(") >> ws >> expression_parser << ws << parsy.string(")"))

expression_parser.become(or_parser)