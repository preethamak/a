import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Play, 
  Save, 
  Download,
  Upload,
  FileText,
  ArrowLeft,
  Zap,
  CheckCircle,
  X,
  FolderPlus,
  Terminal
} from 'lucide-react';
import Particles from '@/components/Particles';

const Practice = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [files, setFiles] = useState([
    { name: 'main.py', content: '# Write your Python code here\nprint("Hello World")', active: true },
  ]);
  const [newFileName, setNewFileName] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('Welcome to CodeLab Practice Terminal\nType your commands here...\n');
  const [terminalInput, setTerminalInput] = useState('');

  const languages = [
    { value: 'python', label: 'Python', template: '# Write your Python code here\nprint("Hello World")', extension: 'py' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}', extension: 'cpp' },
    { value: 'c', label: 'C', template: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}', extension: 'c' },
    { value: 'java', label: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}', extension: 'java' },
    { value: 'javascript', label: 'JavaScript', template: '// Write your JavaScript code here\nconsole.log("Hello World");', extension: 'js' },
    { value: 'html', label: 'HTML', template: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>', extension: 'html' }
  ];

  const practiceProblems = [
    { title: "Hello World", difficulty: "Easy", description: "Print 'Hello World' to the console" },
    { title: "Sum of Two Numbers", difficulty: "Easy", description: "Write a function to add two numbers" },
    { title: "Fibonacci Sequence", difficulty: "Medium", description: "Generate the first n Fibonacci numbers" },
    { title: "Prime Number Checker", difficulty: "Medium", description: "Check if a given number is prime" },
    { title: "Sorting Algorithm", difficulty: "Hard", description: "Implement a sorting algorithm of your choice" }
  ];

  const activeFile = files.find(f => f.active) || files[0];

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    const template = languages.find(lang => lang.value === value)?.template || '';
    const extension = languages.find(lang => lang.value === value)?.extension || 'txt';
    
    // Update active file with new template
    setFiles(prev => prev.map(file => 
      file.active ? { ...file, content: template, name: `main.${extension}` } : file
    ));
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

  const handleSaveCode = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Saved",
      description: `${activeFile.name} has been downloaded to your computer.`,
    });
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
      } else {
        output = `Command '${terminalInput}' executed.\n`;
      }
      setTerminalOutput(prev => prev + output);
    }, 500);
    
    setTerminalInput('');
  };

  const updateActiveFileContent = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.active ? { ...file, content } : file
    ));
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
    <div className="min-h-screen">
      <Particles />
      
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <Code className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Practice Arena
            </span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Badge className="px-4 py-2 text-lg bg-primary/10 text-primary border-primary/20">
            🚀 Sharpen Your Skills
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Practice Coding
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perfect your programming skills with our interactive code editor and practice problems
          </p>
        </div>
      </section>

      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
          {/* Practice Problems Sidebar */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Practice Problems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {practiceProblems.map((problem, index) => (
                <Card key={index} className="p-3 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{problem.title}</h4>
                      <Badge className={getDifficultyColor(problem.difficulty)} variant="secondary">
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{problem.description}</p>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Controls */}
            <Card className="glass-card">
              <CardContent className="py-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
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
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button onClick={handleRunCode} className="neon-button">
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                    
                    <Button onClick={handleSaveCode} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-4 h-full">
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
                      className="h-full min-h-[400px] resize-none font-mono text-sm code-editor border-0 rounded-t-none"
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
                    <div className="bg-background/50 p-3 rounded font-mono text-sm min-h-[100px] max-h-[150px] overflow-y-auto">
                      <div className="text-muted-foreground">
                        Click "Run" to see output here...
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
                    <div className="bg-background/50 p-3 rounded font-mono text-sm min-h-[200px] max-h-[250px] overflow-y-auto">
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
      </div>
    </div>
  );
};

export default Practice;