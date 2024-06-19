classdef testStartupScript < matlab.unittest.TestCase
    properties
        OriginalMWI_MATLAB_STARTUP_SCRIPT
        LogDir
        LogFile
    end
    
    methods (TestMethodSetup)
        function setupEnvironmentVariables(testCase)
            testCase.OriginalMWI_MATLAB_STARTUP_SCRIPT = getenv('MWI_MATLAB_STARTUP_SCRIPT');
            testCase.LogDir = tempname;
            disp("testCase.LogDir")
            disp(testCase.LogDir)
            disp("testCase.LogDir end")
            mkdir(testCase.LogDir);
            setenv('MATLAB_LOG_DIR', testCase.LogDir);
            testCase.LogFile = fullfile(testCase.LogDir, "startup_code_output.txt");
        end
    end
    
    methods (TestMethodTeardown)
        function restoreEnvironmentVariables(testCase)
            setenv('MWI_MATLAB_STARTUP_SCRIPT', testCase.OriginalMWI_MATLAB_STARTUP_SCRIPT);
            rmdir(testCase.LogDir, 's');
        end
    end
    
    methods (Test)
        function testSuccessfulStartupCodeExecution(testCase)
            % Using a command without spaces
            setenv('MWI_MATLAB_STARTUP_SCRIPT', 'disp(42)');
            % runYourScriptHere; % Replace with the command to run your script
            run('evaluateUserMatlabCode.m')

            % Verify the log file contains the expected output
            text = fileread(testCase.LogFile);
            disp("text")
            disp(text)
            disp("text end")
            testCase.verifyTrue(contains(text, '42'));
        end
    end
end