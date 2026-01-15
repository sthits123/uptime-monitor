import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiClient, setToken } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function SigninForm(props: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.signin({ username, password })

      // Store JWT token
      if (response.token) {
        setToken(response.token)
        toast.success(`Welcome back, ${response.username}!`)
        navigate("/dashboard")
      } else {
        toast.error("Invalid response from server")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signin failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <FieldDescription className="text-center mt-4">
                Don't have an account?{" "}
                <a href="/signup" className="text-primary hover:underline">
                  Sign up
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
