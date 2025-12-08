import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockStudents } from '@/data/mockData';
import { TrendingUp, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Seguimiento() {
    const activeStudents = mockStudents.filter(s => s.status === 'activo');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        Seguimiento de Alumnos
                    </h1>
                    <p className="text-muted-foreground">
                        Progreso teórico y práctico de los alumnos activos
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeStudents.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No hay alumnos activos para mostrar seguimiento.
                    </div>
                ) : (
                    activeStudents.map((student) => (
                        <Card key={student.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 pb-4">
                                <Avatar className="h-12 w-12 border-2 border-background">
                                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-base">{student.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{student.dni}</p>
                                </div>
                                <Badge variant="outline">{student.license}</Badge>
                            </CardHeader>
                            <CardContent className="grid gap-6 pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Teórica</span>
                                        <span className="text-muted-foreground">{student.theoreticalProgress}%</span>
                                    </div>
                                    <Progress value={student.theoreticalProgress} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Práctica</span>
                                        <span className="text-muted-foreground">{student.practicalProgress}%</span>
                                    </div>
                                    <Progress value={student.practicalProgress} className="h-2" />
                                </div>
                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="grid gap-1">
                                        <p className="text-xs text-muted-foreground">Clases Prácticas</p>
                                        <p className="font-medium">{student.practicalClasses}</p>
                                    </div>
                                    <div className="grid gap-1 text-right">
                                        <p className="text-xs text-muted-foreground">Profesor</p>
                                        <p className="font-medium text-sm truncate max-w-[120px]">
                                            {/* Would look up teacher name in real app */}
                                            Asignado
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
