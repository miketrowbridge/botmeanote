"""Offline regression tests for the public Python client."""
import contextlib
import io
import runpy
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

CLIENT = Path(__file__).resolve().parents[1] / 'scripts' / 'send-note.py'

class ClientTest(unittest.TestCase):
    def test_descriptive_identity_without_browser_credentials(self):
        response = unittest.mock.MagicMock()
        response.__enter__.return_value.read.return_value = b'{"status":"received"}'
        args = [str(CLIENT), '--question', 'A clearly labeled test question?', '--gap', 'A clearly labeled information gap.', '--test', '--authorized']
        with patch.object(sys, 'argv', args), patch('urllib.request.urlopen', return_value=response) as send, contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            runpy.run_path(str(CLIENT), run_name='__main__')
        send.assert_called_once()
        request = send.call_args.args[0]
        self.assertEqual(request.get_method(), 'POST')
        self.assertEqual(request.get_header('User-agent'), 'BotMeANote/1.0 (+https://github.com/miketrowbridge/botmeanote)')
        self.assertIsNone(request.get_header('Cookie'))
        self.assertIsNone(request.get_header('Authorization'))
        self.assertEqual(send.call_args.kwargs['timeout'], 20)

    def test_missing_authorization_never_sends(self):
        args = [str(CLIENT), '--question', 'A test question?', '--gap', 'A test information gap.']
        with patch.object(sys, 'argv', args), patch('urllib.request.urlopen') as send, contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            runpy.run_path(str(CLIENT), run_name='__main__')
        send.assert_not_called()

if __name__ == '__main__':
    unittest.main()
