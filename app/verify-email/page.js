import { Card } from "@/components/ui/card"
import { Store, MailWarning } from "lucide-react"

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4 gap-6">
            <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Store className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight"><span className="text-primary font-extrabold">M</span>a7l<span className="text-primary font-bold text-4xl">.</span></h1>
            </div>
            
            <Card className="w-full max-w-md p-8 text-center flex flex-col items-center justify-center gap-4">
                <MailWarning className="h-16 w-16 text-yellow-500" />
                <h2 className="text-2xl font-bold text-foreground">تأكيد البريد الإلكتروني</h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                    قمنا بإرسال رابط تفعيل إلى بريدك الإلكتروني. يرجى الضغط عليه لتتمكن من استخدام المنصة.
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg mt-2 text-sm text-right w-full leading-relaxed">
                    <strong>⚠️ تنبيه هام:</strong><br/>
                    إذا لم تقم بتأكيد حسابك خلال 24 ساعة من الآن، سيتم حذف الحساب تلقائياً للحفاظ على الأمان وستحتاج لإنشاء حساب جديد.
                </div>
            </Card>
        </div>
    )
}
