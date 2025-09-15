import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Code, User, Hash, Shield } from 'lucide-react';
import Particles from '@/components/Particles';

const StudentLogin = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [adminRoll, setAdminRoll] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    if (!name || !rollNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and roll number",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('studentName', name);
    localStorage.setItem('studentRoll', rollNumber);
    navigate('/exam');
  };

  const handleAdminLogin = () => {
    if (!adminRoll) {
      toast({
        title: "Missing Information",
        description: "Please enter admin roll number",
        variant: "destructive",
      });
      return;
    }
    
    // Simple admin validation (in real app, this would be server-side)
    if (adminRoll === 'ADMIN123') {
      localStorage.setItem('adminRoll', adminRoll);
      navigate('/admin-dashboard');
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Invalid admin roll number",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Particles />
      
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Code className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CodeLab Access
          </h1>
          <p className="text-muted-foreground">Enter your credentials to begin</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex rounded-lg p-1 glass-card">
          <Button
            variant={!isAdmin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsAdmin(false)}
          >
            <User className="h-4 w-4 mr-2" />
            Student
          </Button>
          <Button
            variant={isAdmin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsAdmin(true)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>

        {/* Login Forms */}
        {!isAdmin ? (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Login
              </CardTitle>
              <CardDescription>
                Enter your details to access the examination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll">Roll Number</Label>
                <Input
                  id="roll"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <Button 
                onClick={handleStudentLogin} 
                className="w-full neon-button"
              >
                Start Examination
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Access
              </CardTitle>
              <CardDescription>
                Authorized personnel only
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminRoll">Admin Roll Number</Label>
                <Input
                  id="adminRoll"
                  placeholder="Enter admin credentials"
                  value={adminRoll}
                  onChange={(e) => setAdminRoll(e.target.value)}
                  className="bg-background/50"
                  type="password"
                />
              </div>
              <Button 
                onClick={handleAdminLogin} 
                className="w-full neon-button"
              >
                <Hash className="h-4 w-4 mr-2" />
                Access Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-primary"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
