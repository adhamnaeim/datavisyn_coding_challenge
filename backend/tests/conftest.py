import os
import pytest
import shutil
from pathlib import Path

@pytest.fixture(scope="session", autouse=True)
def setup_test_csv(tmp_path_factory):
    """
    This fixture runs once per test session. It sets up a test copy of the genes CSV
    and points the app to use that file via environment variable.
    """
    test_data_dir = tmp_path_factory.mktemp("test_data")
    test_csv_path = test_data_dir / "genes_human.csv"

    # Copy the original CSV to a temporary location for safe testing
    original_csv = Path("data/genes_human.csv")
    shutil.copy(original_csv, test_csv_path)

    # Override the CSV path environment variable
    os.environ["GENE_CSV_PATH"] = str(test_csv_path)

    yield
