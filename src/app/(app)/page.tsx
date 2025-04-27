import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 gap-12 bg-background">
      <main className="flex flex-col items-center gap-8 max-w-4xl">

        <h1 className="text-4xl font-bold text-center">Welcome to AnonChat</h1>
        <p className="text-center text-muted-foreground text-lg">
          Connect anonymously. Send and receive honest messages without revealing your identity. Empowering open communication, one message at a time.
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg">Dashboard</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="lg">Sign-up</Button>
          </Link>
        </div>
      </main>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Anonymous Messaging</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Users can send messages without needing to disclose their identity. Your privacy is our top priority.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Signup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Enjoy secure communication built with cutting-edge technologies like Next.js and TailwindCSS.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Custom Suggestions : In future</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stuck on what to say? Use our smart suggested messages to break the ice easily.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Secure & Private</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your data is secured with best practices. We ensure confidentiality and safety of your conversations.
            </p>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-16 text-sm text-muted-foreground">
        Made with ❤️ by Param Saxena
      </footer>
    </div>
  );
}
