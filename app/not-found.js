import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export const metadata = {
    title: "الصفحة غير موجودة | Ma7l",
    description: "عذراً، الصفحة التي تبحث عنها غير موجودة.",
};

export default function NotFound() {
    return (
        <main className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
            <div className="pointer-events-none absolute -top-24 -inset-s-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -inset-e-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <img
                src="/not-found.svg"
                alt="الصفحة غير موجودة"
                className="w-full max-w-md"
            />

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                عذراً، لم نعثر على هذه الصفحة
            </h1>
            <p className="mt-3 max-w-md text-balance text-muted-foreground">
                ربما تم نقل الصفحة أو حذفها، أو أن الرابط الذي اتبعته غير صحيح. لنعيدك إلى المكان الصحيح.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/dashboard/products">
                        <Search className="h-4 w-4" />
                        تصفّح المنتجات
                    </Link>
                </Button>
            </div>
        </main>
    );
}
