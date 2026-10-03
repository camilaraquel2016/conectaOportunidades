#!/usr/bin/env python
"""Utilitario de linha de comando do Django (OportunizaHub / MVP 1)."""

import os
import sys


def main():
    """Executa os comandos administrativos do Django."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Nao foi possivel importar o Django. Verifique se o ambiente virtual "
            "esta ativo e se as dependencias de backend/requirements.txt foram "
            "instaladas com: pip install -r requirements.txt"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
