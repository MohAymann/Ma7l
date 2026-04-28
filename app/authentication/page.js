"use client"
import { Card } from "@/components/ui/card"
import LoginForm from "@/components/ui/login"
import SignupForm from "@/components/ui/signup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("signup")
    return (
        <div className="min-h-screen flex justify-center items-center py-8 px-4">
            <Card className="w-full max-w-md p-6">
                <Tabs dir="rtl" variant="line" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList variant="line" className="w-full grid grid-cols-2">
                        <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                        <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login"><LoginForm /></TabsContent>
                    <TabsContent value="signup"><SignupForm setActiveTab={setActiveTab} /></TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
