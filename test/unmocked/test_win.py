import os
import sys
import unittest

sys.path.append(os.path.abspath("../../"))

from app import check_win


class TestWinCondition(unittest.TestCase):
    def test_win_success(self):
        self.assertFalse(check_win([0, 3, 1, 4]))
        self.assertTrue(check_win([0, 3, 1, 4, 2]))
        self.assertFalse(check_win([0, 3, 1, 4, 8]))
        self.assertTrue(check_win([0, 3, 1, 4, 8, 5]))


if __name__ == "__main__":
    unittest.main()
