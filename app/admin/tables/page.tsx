"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Tables Management</h1>
        <p className="text-muted-foreground">Manage restaurant tables and seating arrangements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tables</CardTitle>
          <CardDescription>Configure and manage table layouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Tables Management</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This feature is coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
