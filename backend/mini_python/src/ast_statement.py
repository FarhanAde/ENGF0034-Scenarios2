from dataclasses import dataclass
from ast_expression import Expression, Identifier

@dataclass
class Statement:
    pass

@dataclass
class Block(Statement):
    statements: list[Statement]

@dataclass
class AssignmentStatement(Statement):
    identifier: Identifier
    expression: Expression

@dataclass
class ExpressionStatement(Statement):
    expression: Expression

@dataclass
class ReturnStatement(Statement):
    expression: Expression

@dataclass
class BreakStatement(Statement):
    pass

@dataclass
class ContinueStatement(Statement):
    pass

@dataclass
class IfStatement(Statement):
    condition: Expression
    block: Block
    else_block: Block

@dataclass
class WhileStatement(Statement):
    condition: Expression
    block: Block

@dataclass
class FunctionDeclaration(Statement):
    identifier: Identifier
    parameters: list[Identifier]
    block: Block

@dataclass
class Program:
    statements: list[Statement]