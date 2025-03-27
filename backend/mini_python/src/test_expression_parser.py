import unittest
from parsy import ParseError

from ast_expression import IntExpression, FloatExpression, StrExpression, BoolExpression
from ast_expression import Add, Sub, Mult, Div, And, Or, Eq, NotEq, Gt, GtE, Lt, LtE, Identifier, FunctionCall
from parser_expression import expression_parser

class TestExpressionParser(unittest.TestCase):

    def assert_parses(self, input_expr, expected_expr):
        result = expression_parser.parse(input_expr)
        self.assertEqual(result, expected_expr)

    def test_integer_expression(self):
        self.assert_parses("42", IntExpression(42))

    def test_float_expression(self):
        self.assert_parses("3.14", FloatExpression(3.14))

    def test_string_expression(self):
        self.assert_parses('"hello"', StrExpression("hello"))

    def test_boolean_expression(self):
        self.assert_parses("True", BoolExpression(True))
        self.assert_parses("False", BoolExpression(False))

    def test_identifier(self):
        self.assert_parses("myVariable", Identifier("myVariable"))
    
    def test_identifier_with_underscores(self):
        self.assert_parses("my_variable", Identifier("my_variable"))
    
    def test_identifier_with_number(self):
        self.assert_parses("my_variable0", Identifier("my_variable0"))

    def test_invalid_identifier(self):
        with self.assertRaises(ParseError):
            expression_parser.parse("0hello")

    def test_binary_operations(self):
        self.assert_parses("1 + 2", Add(IntExpression(1), IntExpression(2)))
        self.assert_parses("3 - 4", Sub(IntExpression(3), IntExpression(4)))
        self.assert_parses("5 * 6", Mult(IntExpression(5), IntExpression(6)))
        self.assert_parses("8 / 2", Div(IntExpression(8), IntExpression(2)))

    def test_comparison_operations(self):
        self.assert_parses("1 < 2", Lt(IntExpression(1), IntExpression(2)))
        self.assert_parses("3 >= 4", GtE(IntExpression(3), IntExpression(4)))
        self.assert_parses("5 == 6", Eq(IntExpression(5), IntExpression(6)))
        self.assert_parses("7 != 8", NotEq(IntExpression(7), IntExpression(8)))
        self.assert_parses("10 < 10", Lt(IntExpression(10), IntExpression(10)))
        self.assert_parses("10 <= 10", LtE(IntExpression(10), IntExpression(10)))
        self.assert_parses("15 > 14", Gt(IntExpression(15), IntExpression(14)))
        self.assert_parses("20 <= 25", LtE(IntExpression(20), IntExpression(25)))
        self.assert_parses("5.5 > 4.5", Gt(FloatExpression(5.5), FloatExpression(4.5)))

    def test_logical_operations(self):
        self.assert_parses("True and False", And(BoolExpression(True), BoolExpression(False)))
        self.assert_parses("True or False", Or(BoolExpression(True), BoolExpression(False)))

    def test_function_call(self):
        self.assert_parses("myFunc(1, 2, 3)", FunctionCall(Identifier("myFunc"), [IntExpression(1), IntExpression(2), IntExpression(3)]))

    def test_complex_expression(self):
        self.assert_parses("1 + 2 * 3", Add(IntExpression(1), Mult(IntExpression(2), IntExpression(3))))
        self.assert_parses("1 - 2 + 3", Add(Sub(IntExpression(1), IntExpression(2)), IntExpression(3)))
        self.assert_parses("1 + (2 - 3)", Add(IntExpression(1), Sub(IntExpression(2), IntExpression(3))))

    def test_nested_function_calls(self):
        self.assert_parses("f()()", FunctionCall(FunctionCall(Identifier("f"), []), []))

    def test_function_call_with_expression(self):
        self.assert_parses("f(x + y) + z", Add(FunctionCall(Identifier("f"), [Add(Identifier("x"), Identifier("y"))]), Identifier("z")))

    def test_multiple_function_calls(self):
        self.assert_parses("f(x) + g(y)", Add(FunctionCall(Identifier("f"), [Identifier("x")]), FunctionCall(Identifier("g"), [Identifier("y")])))

    def test_complex_arithmetic(self):
        self.assert_parses("2 + 3 * 4 / 5", Add(IntExpression(2), Div(Mult(IntExpression(3), IntExpression(4)), IntExpression(5))))

    def test_nested_operations_with_parentheses(self):
        self.assert_parses("(2 - 3) - 4 * 5", Sub(Sub(IntExpression(2), IntExpression(3)), Mult(IntExpression(4), IntExpression(5))))

    def test_chained_binary_operations(self):
        self.assert_parses("1 + 2 - 3 * 4 / 5", Sub(Add(IntExpression(1), IntExpression(2)), Div(Mult(IntExpression(3), IntExpression(4)), IntExpression(5))))

    def test_empty_expression(self):
        with self.assertRaises(ParseError):
            expression_parser.parse("")

    def test_unmatched_parentheses(self):
        with self.assertRaises(ParseError):
            expression_parser.parse("(1 + 2")

    def test_function_with_no_arguments(self):
        self.assert_parses("myFunc()", FunctionCall(Identifier("myFunc"), []))

    def test_multiple_logical_operations(self):
        self.assert_parses("True and False or False and True", Or(And(BoolExpression(True), BoolExpression(False)), And(BoolExpression(False), BoolExpression(True))))

    def test_nested_logical_operations(self):
        self.assert_parses("True and (False or True)", And(BoolExpression(True), Or(BoolExpression(False), BoolExpression(True))))

    def test_mixed_operations_with_parentheses(self):
        self.assert_parses("1 + (2 * 3) - (4 / 2)", Sub(Add(IntExpression(1), Mult(IntExpression(2), IntExpression(3))), Div(IntExpression(4), IntExpression(2))))

    def test_complex_nested_function_calls(self):
        self.assert_parses("f(g(x), h(y)) + k(z)", Add(FunctionCall(Identifier("f"), [FunctionCall(Identifier("g"), [Identifier("x")]), FunctionCall(Identifier("h"), [Identifier("y")])]), FunctionCall(Identifier("k"), [Identifier("z")])))

    def test_string_concatenation(self):
        self.assert_parses('"Hello " + "World!"', Add(StrExpression("Hello "), StrExpression("World!")))
    
    def test_escaped_double_quote(self):
        self.assert_parses(r'"He said, \"Hello!\""', StrExpression('He said, "Hello!"'))  # Escaped double quote

    def test_escaped_backslash(self):
        self.assert_parses('"This is a backslash: \\\\"', StrExpression("This is a backslash: \\"))  # Escaped backslash

    def test_escaped_newline(self):
        self.assert_parses(r'"First line.\nSecond line."', StrExpression("First line.\nSecond line."))  # Newline
    
    def test_empty_string(self):
        self.assert_parses('""', StrExpression(""))  # Empty string

if __name__ == "__main__":
    unittest.main()