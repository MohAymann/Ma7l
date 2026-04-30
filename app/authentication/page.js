"use client"
import { Card } from "@/components/ui/card"
import LoginForm from "@/components/ui/login"
import SignupForm from "@/components/ui/signup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store } from "lucide-react"
import { useState } from "react"

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("signup")
    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4 gap-6">
            <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Store className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight"><span className="text-primary font-extrabold">M</span>a7l<span className="text-primary font-bold text-4xl">.</span></h1>
                <p className="text-sm text-muted-foreground">إدارة متجرك بكل سهولة</p>
            </div>
            <Card className="w-full max-w-md p-6">
                <Tabs dir="rtl" variant="line" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList variant="line" className="w-full grid grid-cols-2">
                        <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                        <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login"><LoginForm setActiveTab={setActiveTab} /></TabsContent>
                    <TabsContent value="signup"><SignupForm setActiveTab={setActiveTab} /></TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
