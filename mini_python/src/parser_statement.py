import parsy

import ast_statement as statement
from parser_expression import expression_parser, ws, identifier_parser

statement_parser = parsy.forward_declaration()

break_statement_parser = (parsy.string("break") << ws << parsy.string(";")).map(lambda _: statement.BreakStatement())

continue_statement_parser = (parsy.string("continue") << ws << parsy.string(";")).map(lambda _: statement.ContinueStatement())

return_statement_parser = parsy.string("return") >> ws >> expression_parser.map(statement.ReturnStatement) << ws << parsy.string(";")

expression_statement_parser = expression_parser.map(statement.ExpressionStatement)  << ws << parsy.string(";")

assignment_statement_parser = parsy.seq(identifier_parser << ws << parsy.string("=") << ws, expression_parser << ws << parsy.string(";")).combine(statement.AssignmentStatement)

block_parser = parsy.string("{") >> ws >> statement_parser.sep_by(ws).map(statement.Block) << ws << parsy.string("}")

if_statement_parser = parsy.seq(parsy.string("if") >> ws >> expression_parser << ws, block_parser, (ws >> parsy.string("else") >> ws >> block_parser).optional(statement.Block([]))).combine(statement.IfStatement)

while_statement_parser = parsy.seq(parsy.string("while") >> ws >> expression_parser << ws, block_parser).combine(statement.WhileStatement)

function_declaration_parser = parsy.seq(parsy.string("def") >> ws >> identifier_parser << ws, parsy.string("(") >> ws >> expression_parser.sep_by(ws << parsy.string(",") << ws) << parsy.string(")") << ws, block_parser).combine(statement.FunctionDeclaration)

statement_parser.become(break_statement_parser | continue_statement_parser | return_statement_parser | expression_statement_parser | assignment_statement_parser | block_parser | if_statement_parser | while_statement_parser | function_declaration_parser)

program_parser = ws >> statement_parser.sep_by(ws).map(statement.Program) << ws