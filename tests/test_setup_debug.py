#!/usr/bin/env python3
"""
Debug tests to understand setup.sh execution issues and template file handling.
"""

import os
import subprocess
import tempfile
import shutil
import pytest
from pathlib import Path


class TestSetupDebug:
    """Debug tests for setup.sh execution issues."""

    @pytest.fixture
    def debug_environment(self):
        """Create debug test environment with detailed logging."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Setup paths
            test_home = temp_path / "test_home"
            test_home.mkdir()
            
            source_dir = temp_path / "source"
            source_dir.mkdir()
            
            # Copy setup.sh
            setup_script = Path("setup.sh")
            if setup_script.exists():
                shutil.copy2(setup_script, source_dir / "setup.sh")
                (source_dir / "setup.sh").chmod(0o755)
                print(f"DEBUG: Copied setup.sh to {source_dir / 'setup.sh'}")
            else:
                print("ERROR: setup.sh not found in current directory")
            
            # Create minimal template files for testing
            custom_modes_template = source_dir / "custom_modes_starter_template.yaml"
            custom_modes_template.write_text("""# Test Custom Modes Template
modes:
  test_mode:
    name: "Test Mode"
    description: "Test mode for debugging"
""")
            print(f"DEBUG: Created template at {custom_modes_template}")
            
            dream_journal_template = source_dir / "dream_journal_starter_template.md"
            dream_journal_template.write_text("""# Test Dream Journal Template

This is a test dream journal template for debugging.
""")
            print(f"DEBUG: Created template at {dream_journal_template}")
            
            yield {
                'temp_path': temp_path,
                'test_home': test_home,
                'source_dir': source_dir,
                'setup_script': source_dir / "setup.sh"
            }

    def test_debug_setup_execution(self, debug_environment):
        """Debug setup.sh execution with detailed output."""
        test_home = debug_environment['test_home']
        source_dir = debug_environment['source_dir']
        
        print(f"\nDEBUG: Test home directory: {test_home}")
        print(f"DEBUG: Source directory: {source_dir}")
        print(f"DEBUG: Files in source directory:")
        for file in source_dir.iterdir():
            print(f"  - {file.name} (executable: {os.access(file, os.X_OK)})")
        
        # Set environment
        env = os.environ.copy()
        env['HOME'] = str(test_home)
        
        # Run setup.sh with verbose output
        result = subprocess.run(
            [str(source_dir / "setup.sh")],
            input="y\n",
            text=True,
            cwd=source_dir,
            env=env,
            capture_output=True
        )
        
        print(f"\nDEBUG: Setup script return code: {result.returncode}")
        print(f"DEBUG: Setup script stdout:")
        print(result.stdout)
        print(f"DEBUG: Setup script stderr:")
        print(result.stderr)
        
        # Check if directories were created
        expected_dir = test_home / "my_new_ai_assistant"
        print(f"DEBUG: Expected directory exists: {expected_dir.exists()}")
        if expected_dir.exists():
            print(f"DEBUG: Contents of {expected_dir}:")
            for item in expected_dir.iterdir():
                print(f"  - {item.name}")
        
        # This test is for debugging - we want to see what happens regardless of success/failure
        assert True, "Debug test completed"

    def test_manual_setup_steps(self, debug_environment):
        """Manually execute setup steps to isolate issues."""
        test_home = debug_environment['test_home']
        source_dir = debug_environment['source_dir']
        
        # Test individual setup.sh functions manually
        
        # 1. Test directory creation
        base_dir = test_home / "my_new_ai_assistant"
        base_dir.mkdir(parents=True, exist_ok=True)
        assert base_dir.exists(), "Base directory should be created"
        print(f"DEBUG: Created base directory: {base_dir}")
        
        # 2. Test template file availability
        custom_modes_template = source_dir / "custom_modes_starter_template.yaml"
        dream_journal_template = source_dir / "dream_journal_starter_template.md"
        
        assert custom_modes_template.exists(), "Custom modes template should exist"
        assert dream_journal_template.exists(), "Dream journal template should exist"
        print("DEBUG: Template files exist")
        
        # 3. Test template copying
        shutil.copy2(custom_modes_template, base_dir / "custom_modes.yaml")
        shutil.copy2(dream_journal_template, base_dir / "dream_journal.md")
        
        assert (base_dir / "custom_modes.yaml").exists(), "Custom modes should be copied"
        assert (base_dir / "dream_journal.md").exists(), "Dream journal should be copied"
        print("DEBUG: Template files copied successfully")
        
        # 4. Test memory directory creation
        memory_dir = base_dir / "memory"
        memory_dir.mkdir(exist_ok=True)
        
        subdirs = ["people", "projects", "patterns", "concepts", "organizations"]
        for subdir in subdirs:
            subdir_path = memory_dir / subdir
            subdir_path.mkdir(exist_ok=True)
            
            # Create basic README
            readme_path = subdir_path / "README.md"
            readme_path.write_text(f"# {subdir.title()} Memory\n\nTest README for {subdir}")
        
        print("DEBUG: Memory directory structure created successfully")
        
        # Verify complete structure
        assert memory_dir.exists(), "Memory directory should exist"
        for subdir in subdirs:
            subdir_path = memory_dir / subdir
            assert subdir_path.exists(), f"Subdirectory {subdir} should exist"
            assert (subdir_path / "README.md").exists(), f"README should exist in {subdir}"
        
        print("DEBUG: Manual setup steps completed successfully")

    def test_template_file_requirements(self, debug_environment):
        """Test what template files setup.sh actually requires."""
        source_dir = debug_environment['source_dir']
        
        # Check if actual template files exist in project
        project_templates = {
            'custom_modes_starter_template.yaml': Path('custom_modes_starter_template.yaml'),
            'dream_journal_starter_template.md': Path('dream_journal_starter_template.md')
        }
        
        print("DEBUG: Checking for project template files:")
        for name, path in project_templates.items():
            exists = path.exists()
            print(f"  - {name}: {'EXISTS' if exists else 'MISSING'}")
            if exists:
                size = path.stat().st_size
                print(f"    Size: {size} bytes")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])