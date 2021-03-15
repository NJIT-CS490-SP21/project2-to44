import os
import sys
import unittest

import unittest.mock as mock
from unittest.mock import patch

sys.path.append(os.path.abspath("../../"))

from app import leaderboard

class TestLeaderboard(unittest.TestCase):
  
  @patch('app.Player')
  def test_leaders(self, mock_player):
    mock_player().return_value.query.return_value.order_by.return_value.limit.return_value.all.return_value = [{'username': 'tes', 'score': 100}]
    self.assertIsNotNone(leaderboard())

if __name__ == "__main__":
    unittest.main()
