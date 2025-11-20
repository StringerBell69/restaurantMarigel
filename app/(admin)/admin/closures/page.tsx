"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Trash2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Closure {
  id: string;
  startDatetime: string;
  endDatetime: string;
  reason: string;
  tableId: string | null;
}

export default function ClosuresPage() {
  const [closures, setClosures] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    type: "full_day" as "full_day" | "early_close" | "partial",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    fetchClosures();
  }, []);

  const fetchClosures = async () => {
    try {
      const response = await fetch('/api/admin/closures');
      const data = await response.json();

      if (data.success) {
        setClosures(data.closures);
      }
    } catch (error) {
      console.error('Error fetching closures:', error);
    }
  };

  const handleCreateClosure = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/closures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      toast.success('Fermeture exceptionnelle créée avec succès');
      setShowForm(false);
      setFormData({
        date: "",
        type: "full_day",
        startTime: "",
        endTime: "",
        reason: "",
      });
      fetchClosures();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClosure = async (date: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette fermeture ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/closures?date=${date}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      toast.success('Fermeture supprimée avec succès');
      fetchClosures();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  // Group closures by date
  const groupedClosures = closures.reduce((acc, closure) => {
    const date = new Date(closure.startDatetime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(closure);
    return acc;
  }, {} as Record<string, Closure[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fermetures Exceptionnelles</h1>
          <p className="text-muted-foreground">
            Gérez les fermetures du restaurant (jours fériés, fermeture anticipée, etc.)
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Annuler' : 'Nouvelle Fermeture'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une Fermeture Exceptionnelle</CardTitle>
            <CardDescription>
              Bloquez toutes les réservations pour une période donnée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateClosure} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de Fermeture</Label>
                  <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="full_day">Journée complète</option>
                    <option value="early_close">Fermeture anticipée</option>
                    <option value="partial">Fermeture partielle</option>
                  </select>
                </div>
              </div>

              {formData.type !== 'full_day' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Heure de début</Label>
                    <Input
                      id="startTime"
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Heure de fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Raison de la Fermeture</Label>
                <Input
                  id="reason"
                  required
                  placeholder="Ex: Jour férié, Événement privé, Travaux, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 rounded-md border border-orange-500/50 bg-orange-50 p-3 text-sm text-orange-700">
                <AlertCircle className="h-4 w-4" />
                <p>
                  Cette action bloquera <strong>toutes les tables</strong> du restaurant pour la période sélectionnée.
                  Les clients ne pourront pas réserver pendant cette période.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
              >
                {loading ? 'Création...' : 'Créer la Fermeture'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Closures List */}
      <Card>
        <CardHeader>
          <CardTitle>Fermetures à Venir</CardTitle>
          <CardDescription>
            Liste des fermetures exceptionnelles programmées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedClosures).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Aucune fermeture exceptionnelle programmée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedClosures)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, closuresForDate]) => {
                  const closure = closuresForDate[0];
                  const startDate = new Date(closure.startDatetime);
                  const endDate = new Date(closure.endDatetime);

                  const isFullDay =
                    startDate.getHours() === 0 &&
                    endDate.getHours() === 23;

                  return (
                    <div
                      key={date}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-orange-100 p-2">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {new Date(date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isFullDay ? (
                              'Fermé toute la journée'
                            ) : (
                              <>
                                Fermé de {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                {' '}à {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Raison: {closure.reason.split(':')[1]?.trim() || closure.reason}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {closuresForDate.length} table(s) bloquée(s)
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClosure(date)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
