import os
import sys
import unittest

sys.path.append(os.path.abspath("../../"))

from app import on_move


class TestOnMove(unittest.TestCase):
    def test_move_success(self):
        self.assertEqual(on_move(0, [1, 2, 3, 4, 5, 6, 7, 8]), "Tie")
        self.assertEqual(on_move(7, [0, 2, 5, 3, 1, 4, 6]), None)


if __name__ == "__main__":
    unittest.main()
