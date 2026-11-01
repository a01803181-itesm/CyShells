"""Configuration module for the logging system and visual formatting of logs.

Configure custom levels such as SUCCESS and apply ANSI colours according to the severity of the message.
"""

import logging

SUCCESS = 60

logging.addLevelName(SUCCESS, "SUCCESS")

class ColouredFormatter(logging.Formatter):
    """Log record formatter with support for console colours using ANSI escape codes.

    Attributes:
        COLOURS (dict): Mapping of logging levels to ANSI escape sequences.
        RESET (str): ANSI sequence to reset the terminal colour.
    """

    COLOURS = {
        logging.INFO: "\x1b[36m",
        logging.WARNING: "\x1b[33m",
        logging.ERROR: "\x1b[31m",
        SUCCESS: "\x1b[32m" 
    }
    RESET = "\x1b[0m"

    def format(self, record: logging.LogRecord) -> str:
        """Applies ANSI colour styles to the log level name and formats the message.

        Args:
            record (logging.LogRecord): An object containing the details of the log event to be issued.

        Returns:
            str: Formatted string from the register with the corresponding colour sequences.

        Raises:
            Exception: If an unexpected error occurs whilst formatting the log.
        """
        colour = self.COLOURS.get(record.levelno, self.RESET)
        record.levelname = f"{colour}{record.levelname}{self.RESET}"
        record.msg = f"{record.msg}"
        return super().format(record)

handler = logging.StreamHandler()
handler.setFormatter(ColouredFormatter("[%(levelname)s] %(message)s"))
logging.basicConfig(level=logging.INFO, handlers=[handler])

logger = logging.getLogger(__name__)