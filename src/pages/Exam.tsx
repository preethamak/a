import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Timer, 
  Code, 
  Play, 
  Save, 
  AlertTriangle, 
  Lock,
  CheckCircle,
  FileText,
  FolderPlus,
  Terminal,
  X,
  Zap
} from 'lucide-react';

const Exam = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [studentName] = useState(localStorage.getItem('studentName') || '');
  const [studentRoll] = useState(localStorage.getItem('studentRoll') || '');
  const [files, setFiles] = useState([
    { name: 'main.py', content: '# Write your Python code here\nprint("Hello World")', active: true },
  ]);
  const [newFileName, setNewFileName] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('CodeLab Exam Terminal\n$ Ready for execution...\n');
  const [terminalInput, setTerminalInput] = useState('');

  const languages = [
    { value: 'python', label: 'Python', template: '# Write your Python code here\nprint("Hello World")' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}' },
    { value: 'c', label: 'C', template: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}' },
    { value: 'java', label: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' },
    { value: 'javascript', label: 'JavaScript', template: '// Write your JavaScript code here\nconsole.log("Hello World");' },
    { value: 'html', label: 'HTML', template: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>' }
  ];

  const questions = [
    {
      id: 1,
      title: "Array Sum Problem",
      description: "Write a function to find the sum of all elements in an array.",
      difficulty: "Easy",
      points: 10
    },
    {
      id: 2,
      title: "Palindrome Checker",
      description: "Create a function that checks if a given string is a palindrome.",
      difficulty: "Medium",
      points: 15
    },
    {
      id: 3,
      title: "Binary Search Implementation",
      description: "Implement binary search algorithm for a sorted array.",
      difficulty: "Hard",
      points: 20
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!studentName || !studentRoll) {
      navigate('/login');
      return;
    }

    // Enable fullscreen and lock
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsLocked(true);
      } catch (error) {
        console.error('Fullscreen failed:', error);
      }
    };

    enterFullscreen();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Prevent tab switching and other cheating attempts
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast({
          title: "Warning!",
          description: "Tab switching detected. This action has been logged.",
          variant: "destructive",
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, etc.
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Developer tools are disabled during the exam.",
          variant: "destructive",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [studentName, studentRoll, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeFile = files.find(f => f.active) || files[0];

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    const template = languages.find(lang => lang.value === value)?.template || '';
    const extension = languages.find(lang => lang.value === value)?.label.toLowerCase() || 'txt';
    
    // Update active file with new template
    setFiles(prev => prev.map(file => 
      file.active ? { ...file, content: template, name: `main.${getFileExtension(value)}` } : file
    ));
  };

  const getFileExtension = (language: string) => {
    const extensions: { [key: string]: string } = {
      python: 'py',
      cpp: 'cpp',
      c: 'c',
      java: 'java',
      javascript: 'js',
      html: 'html'
    };
    return extensions[language] || 'txt';
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    const newFile = {
      name: newFileName,
      content: '',
      active: false
    };
    
    setFiles(prev => [...prev, newFile]);
    setNewFileName('');
    
    toast({
      title: "File Created",
      description: `${newFileName} has been created successfully.`,
    });
  };

  const handleFileSwitch = (fileName: string) => {
    setFiles(prev => prev.map(file => ({
      ...file,
      active: file.name === fileName
    })));
  };

  const handleDeleteFile = (fileName: string) => {
    if (files.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one file open.",
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.name !== fileName);
      if (prev.find(f => f.name === fileName)?.active && updatedFiles.length > 0) {
        updatedFiles[0].active = true;
      }
      return updatedFiles;
    });
  };

  const updateActiveFileContent = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.active ? { ...file, content } : file
    ));
  };

  const handleTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    
    setTerminalOutput(prev => prev + `$ ${terminalInput}\n`);
    
    // Simulate command execution
    setTimeout(() => {
      let output = '';
      if (terminalInput.includes('ls')) {
        output = files.map(f => f.name).join('  ') + '\n';
      } else if (terminalInput.includes('clear')) {
        setTerminalOutput('Terminal cleared.\n');
        setTerminalInput('');
        return;
      } else if (terminalInput.includes('run') || terminalInput.includes('execute')) {
        output = `Executing ${activeFile.name}...\nHello World\nExecution completed.\n`;
      } else {
        output = `Command '${terminalInput}' executed.\n`;
      }
      setTerminalOutput(prev => prev + output);
    }, 500);
    
    setTerminalInput('');
  };

  const handleRunCode = () => {
    setTerminalOutput(prev => prev + `\n$ Running ${activeFile.name}...\n`);
    
    setTimeout(() => {
      setTerminalOutput(prev => prev + `Hello World\nExecution completed successfully.\n`);
      toast({
        title: "Code Executed",
        description: "Your code has been compiled and executed successfully.",
      });
    }, 1000);
  };

  const handleSaveProgress = () => {
    // Save to localStorage for persistence
    localStorage.setItem(`exam_progress_${studentRoll}`, JSON.stringify({
      currentQuestion,
      code,
      selectedLanguage,
      timeLeft
    }));
    
    toast({
      title: "Progress Saved",
      description: "Your work has been automatically saved.",
    });
  };

  const handleSubmitExam = () => {
    // Calculate mock results
    const mockScore = Math.floor(Math.random() * 45) + 55; // 55-100
    const mockSpeed = Math.floor(Math.random() * 50) + 50; // 50-100
    const mockEfficiency = Math.floor(Math.random() * 40) + 60; // 60-100
    
    localStorage.setItem('examResults', JSON.stringify({
      studentName,
      studentRoll,
      score: mockScore,
      speed: mockSpeed,
      efficiency: mockEfficiency,
      completedAt: new Date().toISOString()
    }));

    navigate('/analysis');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'Hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between glass-card p-4">
        <div className="flex items-center gap-4">
          <Lock className="h-6 w-6 text-destructive" />
          <div>
            <h1 className="font-bold text-lg">CodeLab Examination</h1>
            <p className="text-sm text-muted-foreground">
              {studentName} • {studentRoll}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-destructive" />
            <span className="font-mono text-lg font-bold text-destructive">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <Button onClick={handleSaveProgress} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button onClick={handleSubmitExam} className="neon-button">
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
        {/* Question Panel */}
        <div className="space-y-4">
          {/* Question Navigation */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Questions</CardTitle>
                <Badge variant="secondary">
                  {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    className="w-12 h-12"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card className="glass-card flex-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {questions[currentQuestion].title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(questions[currentQuestion].difficulty)}>
                      {questions[currentQuestion].difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {questions[currentQuestion].points} points
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {questions[currentQuestion].description}
              </p>
              
              <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">Sample Input:</h4>
                <code className="text-sm font-mono">arr = [1, 2, 3, 4, 5]</code>
                
                <h4 className="font-semibold mb-2 mt-4">Expected Output:</h4>
                <code className="text-sm font-mono">15</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor Panel */}
        <div className="space-y-4">
          {/* Language Selector */}
          <Card className="glass-card">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Code className="h-5 w-5 text-primary" />
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button onClick={handleRunCode} className="neon-button ml-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-300px)]">
            {/* File Manager & Editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* File Tabs */}
              <Card className="glass-card">
                <CardContent className="py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {files.map((file) => (
                      <div key={file.name} className="flex items-center">
                        <Button
                          variant={file.active ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleFileSwitch(file.name)}
                          className="rounded-r-none"
                        >
                          {file.name}
                        </Button>
                        {files.length > 1 && (
                          <Button
                            variant={file.active ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handleDeleteFile(file.name)}
                            className="rounded-l-none border-l-0 px-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Input
                        placeholder="filename.ext"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="w-32 h-8"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
                      />
                      <Button size="sm" onClick={handleCreateFile} variant="outline">
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <Card className="glass-card flex-1">
                <CardContent className="p-0 h-full">
                  <Textarea
                    value={activeFile.content}
                    onChange={(e) => updateActiveFileContent(e.target.value)}
                    className="h-full min-h-[350px] resize-none font-mono text-sm code-editor border-0 rounded-t-none"
                    placeholder="Write your code here..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Terminal & Output */}
            <div className="space-y-4">
              {/* Output Panel */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/50 p-3 rounded font-mono text-sm min-h-[100px] max-h-[120px] overflow-y-auto">
                    <div className="text-muted-foreground">
                      Click "Run Code" to see output here...
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terminal */}
              <Card className="glass-card flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-background/50 p-3 rounded font-mono text-sm min-h-[150px] max-h-[200px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                      {terminalOutput}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter command..."
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTerminalCommand()}
                      className="font-mono text-sm"
                    />
                    <Button size="sm" onClick={handleTerminalCommand}>
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      {isLocked && (
        <div className="fixed bottom-4 right-4">
          <Card className="glass-card border-destructive/20">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4" />
                Exam mode active - Screen locked
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Exam;