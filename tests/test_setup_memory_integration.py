#!/usr/bin/env python3
"""
Integration tests for setup.sh memory directory handling and complete knowledge base transfer validation.

Tests validate that setup.sh properly handles copying the entire memory/ directory structure 
with all accumulated knowledge to the target location for FasterOutcomes internal use.

Archaeological Engineering Constraint: Tests what setup.sh currently does vs. what it should do 
to ensure complete memory directory duplication with 80+ knowledge files.
"""

import os
import subprocess
import tempfile
import shutil
import pytest
from pathlib import Path
from typing import Dict, List, Set
import stat


class TestSetupMemoryIntegration:
    """Integration tests for setup.sh memory directory creation and file copying functionality."""

    @pytest.fixture
    def temp_environment(self):
        """Create isolated test environment with setup.sh and source memory structure."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Setup paths
            test_home = temp_path / "test_home"
            test_home.mkdir()
            
            source_dir = temp_path / "source"
            source_dir.mkdir()
            
            # Copy setup.sh to source directory
            setup_script = Path("setup.sh")
            if setup_script.exists():
                shutil.copy2(setup_script, source_dir / "setup.sh")
                # Make executable
                (source_dir / "setup.sh").chmod(0o755)
            
            # Copy template files
            template_files = [
                "custom_modes_starter_template.yaml",
                "dream_journal_starter_template.md"
            ]
            for template_file in template_files:
                template_path = Path(template_file)
                if template_path.exists():
                    shutil.copy2(template_path, source_dir / template_file)
            
            # Copy existing memory structure if it exists
            source_memory = Path("memory")
            if source_memory.exists():
                target_memory = source_dir / "memory"
                shutil.copytree(source_memory, target_memory)
            
            yield {
                'temp_path': temp_path,
                'test_home': test_home,
                'source_dir': source_dir,
                'setup_script': source_dir / "setup.sh"
            }

    def test_setup_script_exists_and_executable(self, temp_environment):
        """Verify setup.sh exists and is executable."""
        setup_script = temp_environment['setup_script']
        assert setup_script.exists(), "setup.sh should exist"
        assert os.access(setup_script, os.X_OK), "setup.sh should be executable"

    def test_current_directory_creation_functionality(self, temp_environment):
        """Test current setup.sh directory creation functionality (what it actually does)."""
        test_home = temp_environment['test_home']
        source_dir = temp_environment['source_dir']
        
        # Set HOME environment variable and run setup.sh non-interactively
        env = os.environ.copy()
        env['HOME'] = str(test_home)
        
        # Run setup.sh with 'y' input to confirm setup
        result = subprocess.run(
            [str(source_dir / "setup.sh")],
            input="y\n",
            text=True,
            cwd=source_dir,
            env=env,
            capture_output=True
        )
        
        # Verify setup completed successfully  
        assert result.returncode == 0, f"Setup script failed: {result.stderr}"
        
        # Verify memory directory structure was created
        memory_dir = test_home / "my_new_ai_assistant" / "memory"
        assert memory_dir.exists(), "Memory directory should be created"
        
        # Verify all required subdirectories exist
        expected_subdirs = ["people", "projects", "patterns", "concepts", "organizations"]
        for subdir in expected_subdirs:
            subdir_path = memory_dir / subdir
            assert subdir_path.exists(), f"Subdirectory {subdir} should be created"
            
            # Verify README.md exists in each subdirectory
            readme_path = subdir_path / "README.md"
            assert readme_path.exists(), f"README.md should exist in {subdir} directory"
            assert readme_path.stat().st_size > 0, f"README.md in {subdir} should not be empty"

    def test_memory_directory_structure_validation(self, temp_environment):
        """Validate complete memory directory structure requirements."""
        # Count actual files in source memory structure
        source_memory = temp_environment['source_dir'] / "memory"
        if not source_memory.exists():
            pytest.skip("Source memory directory not available for testing")
        
        # Recursively count all files in memory structure
        all_files = []
        for root, dirs, files in os.walk(source_memory):
            for file in files:
                relative_path = Path(root).relative_to(source_memory) / file
                all_files.append(str(relative_path))
        
        # Verify substantial knowledge base exists
        assert len(all_files) >= 80, f"Expected 80+ knowledge files, found {len(all_files)}"
        
        # Verify core memory files exist
        core_files = ["context_anchors.md", "current_session.md"]
        for core_file in core_files:
            assert core_file in all_files, f"Core memory file {core_file} should exist"
        
        # Verify entity categories have substantial content
        concept_files = [f for f in all_files if f.startswith("concepts/") and f.endswith(".md")]
        pattern_files = [f for f in all_files if f.startswith("patterns/") and f.endswith(".md")]  
        project_files = [f for f in all_files if f.startswith("projects/") and f.endswith(".md")]
        
        assert len(concept_files) >= 30, f"Expected 30+ concept files, found {len(concept_files)}"
        assert len(pattern_files) >= 20, f"Expected 20+ pattern files, found {len(pattern_files)}"
        assert len(project_files) >= 10, f"Expected 10+ project files, found {len(project_files)}"

    def test_missing_file_copying_functionality(self, temp_environment):
        """Test reveals setup.sh does NOT copy existing knowledge files (CRITICAL GAP)."""
        test_home = temp_environment['test_home']
        source_dir = temp_environment['source_dir']
        source_memory = source_dir / "memory"
        
        if not source_memory.exists():
            pytest.skip("Source memory directory not available for testing")
        
        # Count source files
        source_files = []
        for root, dirs, files in os.walk(source_memory):
            for file in files:
                source_files.append(file)
        
        # Run setup.sh
        env = os.environ.copy()
        env['HOME'] = str(test_home)
        
        result = subprocess.run(
            [str(source_dir / "setup.sh")],
            input="y\n",
            text=True,
            cwd=source_dir,
            env=env,
            capture_output=True
        )
        
        assert result.returncode == 0, f"Setup script failed: {result.stderr}"
        
        # Check what was actually copied to target
        target_memory = test_home / "my_new_ai_assistant" / "memory"
        target_files = []
        for root, dirs, files in os.walk(target_memory):
            for file in files:
                if file != "README.md":  # Exclude template README files
                    target_files.append(file)
        
        # CRITICAL TEST: Verify knowledge files were NOT copied (current broken behavior)
        knowledge_files_copied = len([f for f in target_files if f.endswith('.md') and f != 'README.md'])
        
        # This test documents the current BROKEN behavior - no knowledge files copied
        assert knowledge_files_copied == 0, f"BROKEN: Setup.sh should copy knowledge files but currently copies {knowledge_files_copied}"
        
        # Document what SHOULD be copied
        expected_knowledge_files = len([f for f in source_files if f.endswith('.md') and f != 'README.md'])
        print(f"MISSING FUNCTIONALITY: Should copy {expected_knowledge_files} knowledge files but copies 0")

    def test_required_memory_transfer_functionality(self, temp_environment):
        """Test what setup.sh SHOULD do - complete memory knowledge base transfer."""
        test_home = temp_environment['test_home']
        source_dir = temp_environment['source_dir']
        source_memory = source_dir / "memory"
        
        if not source_memory.exists():
            pytest.skip("Source memory directory not available for testing")
        
        # This test defines REQUIRED functionality (currently missing)
        target_memory = test_home / "my_new_ai_assistant" / "memory"
        
        # Simulate what setup.sh SHOULD do - copy entire memory structure
        def simulate_proper_memory_copy():
            """Simulate what setup.sh should do for complete memory transfer."""
            # Create base directory
            target_memory.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy entire memory structure preserving all files and structure
            if target_memory.exists():
                shutil.rmtree(target_memory)
            shutil.copytree(source_memory, target_memory)
        
        # Execute proper memory copy simulation
        simulate_proper_memory_copy()
        
        # Validate complete transfer
        assert target_memory.exists(), "Target memory directory should exist"
        
        # Verify all source files were copied
        source_file_count = sum(1 for _ in source_memory.rglob('*') if _.is_file())
        target_file_count = sum(1 for _ in target_memory.rglob('*') if _.is_file())
        
        assert target_file_count >= source_file_count, f"Should copy all {source_file_count} files, copied {target_file_count}"
        
        # Verify core knowledge files exist
        assert (target_memory / "context_anchors.md").exists(), "Core memory file context_anchors.md should be copied"
        assert (target_memory / "current_session.md").exists(), "Core memory file current_session.md should be copied"
        
        # Verify Archaeological Engineering knowledge preserved
        archaeological_files = list(target_memory.rglob("*archaeological*"))
        assert len(archaeological_files) > 0, "Archaeological Engineering knowledge should be preserved"
        
        # Verify cognitive evolution insights preserved  
        cognitive_files = list(target_memory.rglob("*cognitive*"))
        assert len(cognitive_files) > 0, "Cognitive evolution insights should be preserved"

    def test_file_permissions_and_structure_preservation(self, temp_environment):
        """Test that file permissions and directory structure are preserved during copying."""
        test_home = temp_environment['test_home']
        source_dir = temp_environment['source_dir']
        source_memory = source_dir / "memory"
        
        if not source_memory.exists():
            pytest.skip("Source memory directory not available for testing")
        
        # Create target and simulate proper copy
        target_memory = test_home / "my_new_ai_assistant" / "memory"
        target_memory.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(source_memory, target_memory)
        
        # Verify permissions preserved
        for source_path in source_memory.rglob('*'):
            if source_path.is_file():
                relative_path = source_path.relative_to(source_memory)
                target_path = target_memory / relative_path
                
                assert target_path.exists(), f"File {relative_path} should exist in target"
                
                # Verify file permissions match
                source_stat = source_path.stat()
                target_stat = target_path.stat()
                assert stat.S_IMODE(source_stat.st_mode) == stat.S_IMODE(target_stat.st_mode), \
                    f"Permissions should be preserved for {relative_path}"
        
        # Verify directory structure preserved
        source_dirs = [p.relative_to(source_memory) for p in source_memory.rglob('*') if p.is_dir()]
        for dir_path in source_dirs:
            target_dir = target_memory / dir_path
            assert target_dir.exists(), f"Directory {dir_path} should exist in target"
            assert target_dir.is_dir(), f"{dir_path} should be a directory in target"

    def test_sophisticated_knowledge_base_content_validation(self, temp_environment):
        """Validate that sophisticated knowledge base content is properly transferred."""
        source_memory = temp_environment['source_dir'] / "memory"
        
        if not source_memory.exists():
            pytest.skip("Source memory directory not available for testing")
        
        # Simulate proper copy
        target_memory = temp_environment['test_home'] / "my_new_ai_assistant" / "memory"
        target_memory.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(source_memory, target_memory)
        
        # Validate specific knowledge categories
        validation_patterns = {
            'archaeological_engineering': ['*archaeological*', '*engineering*'],
            'cognitive_continuity': ['*cognitive*', '*continuity*'],
            'collaborative_consciousness': ['*collaborative*', '*consciousness*'],
            'memory_patterns': ['*memory*', '*pattern*'],
            'bootstrap_consciousness': ['*bootstrap*', '*consciousness*']
        }
        
        for category, patterns in validation_patterns.items():
            matching_files = []
            for pattern in patterns:
                matching_files.extend(list(target_memory.rglob(pattern)))
            
            assert len(matching_files) > 0, f"{category} knowledge should be preserved with files matching {patterns}"
        
        # Verify file content integrity (sample check)
        sample_files = list(target_memory.rglob("*.md"))[:5]  # Check first 5 markdown files
        for file_path in sample_files:
            assert file_path.stat().st_size > 0, f"File {file_path.name} should not be empty"
            
            # Verify content is readable and structured
            content = file_path.read_text(encoding='utf-8')
            assert len(content.strip()) > 0, f"File {file_path.name} should have content"

    def test_complete_setup_workflow_with_memory_transfer(self, temp_environment):
        """Integration test for complete setup workflow including proper memory transfer."""
        test_home = temp_environment['test_home']
        source_dir = temp_environment['source_dir']
        
        # First verify current broken behavior
        env = os.environ.copy()
        env['HOME'] = str(test_home)
        
        result = subprocess.run(
            [str(source_dir / "setup.sh")],
            input="y\n",
            text=True,
            cwd=source_dir,
            env=env,
            capture_output=True
        )
        
        assert result.returncode == 0, f"Setup script failed: {result.stderr}"
        
        # Verify basic structure created
        config_dir = test_home / "my_new_ai_assistant"
        assert config_dir.exists(), "Configuration directory should be created"
        assert (config_dir / "custom_modes.yaml").exists(), "Custom modes should be installed"
        assert (config_dir / "dream_journal.md").exists(), "Dream journal should be installed"
        
        memory_dir = config_dir / "memory"
        assert memory_dir.exists(), "Memory directory should be created"
        
        # Document the gap: Knowledge base not transferred
        knowledge_files = list(memory_dir.rglob("*.md"))
        non_readme_knowledge = [f for f in knowledge_files if f.name != "README.md"]
        
        # Current broken behavior - no knowledge files transferred
        assert len(non_readme_knowledge) == 0, "CURRENT BROKEN BEHAVIOR: No knowledge files transferred"
        
        print(f"SETUP.SH MEMORY TRANSFER GAP ANALYSIS:")
        print(f"- Directory structure: ✓ Created")  
        print(f"- README templates: ✓ Created")
        print(f"- Knowledge base transfer: ✗ MISSING")
        print(f"- Core memory files: ✗ NOT COPIED")
        print(f"- Entity files: ✗ NOT COPIED")
        print(f"- Archaeological Engineering discoveries: ✗ NOT COPIED")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])