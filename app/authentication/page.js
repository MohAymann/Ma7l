import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
    return (
        <div className="size-full h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm p-5 flex justify-center">
                <Tabs dir="rtl" variant="line" className="w-full">
                    <TabsList variant="line" className="w-full flex gap-20">
                        <TabsTrigger value="login" className="max-w-10 ring-0">تسجيل الدخول</TabsTrigger>
                        <TabsTrigger value="signup" className="max-w-10">إنشاء حساب</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">صفحة تسجيل الدخول</TabsContent>
                    <TabsContent value="signup">صفحة انشاء الحساب</TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
