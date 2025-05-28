import { Card, CardContent } from "@/components/ui/card";
import { ShoppingListClient } from "@/app/shopping-list-client";
import { getAllItems } from "@/repositories/shopping-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await getAllItems();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Shopping List</h1>
        <Card>
          <CardContent className="p-6">
            <ShoppingListClient items={items} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
