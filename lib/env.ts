export const ENV = {
  CLERK_PUBLISHABLE: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET: process.env.CLERK_SECRET_KEY || "",
  PADDLE: {
    MONTHLY: process.env.NEXT_PUBLIC_PADDLE_MONTHLY || "",
    QTR: process.env.NEXT_PUBLIC_PADDLE_QTR || "",
    SEMI: process.env.NEXT_PUBLIC_PADDLE_SEMI || "",
    YEARLY: process.env.NEXT_PUBLIC_PADDLE_YEARLY || "",
    WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET || ""
  },
  SUPABASE: {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SERVICE: process.env.SUPABASE_SERVICE_ROLE || ""
  },
};
