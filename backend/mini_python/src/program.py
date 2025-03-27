from ast_statement import Program
from parser_statement import program_parser
from new_program_state import run_statement, ProgramState, Ok

class MiniPythonInterpreter:
    def __init__(self):
        pass

    def run_code(self, code: str):
        program: Program = program_parser.parse(code)
        program_state = ProgramState()
        
        for stmt in program.statements:
            result = run_statement(stmt, program_state)
            assert isinstance(result, Ok)
