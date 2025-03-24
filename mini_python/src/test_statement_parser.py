import unittest

from parsy import ParseError

from parser_statement import statement_parser
from ast_statement import (
    AssignmentStatement,
    ExpressionStatement,
    ReturnStatement,
    BreakStatement,
    ContinueStatement,
    IfStatement,
    WhileStatement,
    FunctionDeclaration,
    Block,
)

from ast_expression import (
    Lt,
    Gt,
    Add,
    IntExpression,
    Identifier,
)

class TestStatementParser(unittest.TestCase):

    def assert_parses(self, input_stmt, expected_stmt):
        result = statement_parser.parse(input_stmt)
        self.assertEqual(result, expected_stmt)

    def test_assignment_statement(self):
        self.assert_parses("number = 5;", 
            AssignmentStatement(
                identifier=Identifier("number"),
                expression=IntExpression(5)
            )
        )

    def test_expression_statement(self):
        self.assert_parses("42;", 
            ExpressionStatement(
                expression=IntExpression(42)
            )
        )

    def test_break_statement(self):
        self.assert_parses("break;", 
            BreakStatement()
        )

    def test_continue_statement(self):
        self.assert_parses("continue;", 
            ContinueStatement()
        )

    def test_if_statement(self):
        condition = Lt(
            expr1=Identifier("x"),
            expr2=IntExpression(10)
        )
        self.assert_parses(
            "if (x < 10) { y = 5; }",
            IfStatement(
                condition=condition,
                block=Block(statements=[
                    AssignmentStatement(
                        identifier=Identifier("y"),
                        expression=IntExpression(5)
                    )
                ]),
                else_block=Block(statements=[])  # No else block
            )
        )

    def test_if_else_statement(self):
        condition = Lt(
            expr1=Identifier("x"),
            expr2=IntExpression(10)
        )
        self.assert_parses(
            "if (x < 10) { y = 5; } else { z = 10; }",
            IfStatement(
                condition=condition,
                block=Block(statements=[
                    AssignmentStatement(
                        identifier=Identifier("y"),
                        expression=IntExpression(5)
                    )
                ]),
                else_block=Block(statements=[
                    AssignmentStatement(
                        identifier=Identifier("z"),
                        expression=IntExpression(10)
                    )
                ])
            )
        )

    def test_while_statement(self):
        condition = Lt(
            expr1=Identifier("i"),
            expr2=IntExpression(10)
        )
        self.assert_parses(
            "while (i < 10) { i = i + 1; }",
            WhileStatement(
                condition=condition,
                block=Block(statements=[
                    AssignmentStatement(
                        identifier=Identifier("i"),
                        expression=Add(
                            expr1=Identifier("i"),
                            expr2=IntExpression(1)
                        )
                    )
                ])
            )
        )

    def test_function_declaration(self):
        self.assert_parses(
            "def myFunc(x, y) { return x + y; }",
            FunctionDeclaration(
                identifier=Identifier("myFunc"),
                parameters=[Identifier("x"), Identifier("y")],
                block=Block(statements=[
                    ReturnStatement(
                        expression=Add(
                            expr1=Identifier("x"),
                            expr2=Identifier("y")
                        )
                    )
                ])
            )
        )

    def test_nested_blocks(self):
        self.assert_parses(
            "{ number = 5; if (number > 0) { continue; } }",
            Block(statements=[
                AssignmentStatement(
                    identifier=Identifier("number"),
                    expression=IntExpression(5)
                ),
                IfStatement(
                    condition=Gt(
                        expr1=Identifier("number"),
                        expr2=IntExpression(0)
                    ),
                    block=Block(statements=[
                        ContinueStatement()
                    ]),
                    else_block=Block(statements=[])  # No else block present
                )
            ])
        )

    def test_empty_statement(self):
        with self.assertRaises(ParseError):
            statement_parser.parse("")

    def test_unterminated_statement(self):
        with self.assertRaises(ParseError):
            statement_parser.parse("number = 5")

    def test_invalid_statement(self):
        with self.assertRaises(ParseError):
            statement_parser.parse("invalid statement;")

if __name__ == "__main__":
    unittest.main()