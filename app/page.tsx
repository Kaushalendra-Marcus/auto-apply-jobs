import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-muted to-background">
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Soft glowing accents */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl filter"></div>
      <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/5 blur-3xl filter"></div>

      <div className="container relative mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <h1 className="text-3xl font-bold text-primary">
            AutoApply Pro
          </h1>
          <Link href="/login">
            <Button variant="outline" className="rounded-full px-6 py-2">
              Get Started
            </Button>
          </Link>
        </header>

        {/* Hero Section */}
        <main className="text-center">
          <div className="relative mx-auto max-w-4xl">
            <h2 className="text-5xl font-extrabold leading-tight text-secondary md:text-6xl lg:text-7xl">
              Automate Your{" "}
              <span className="text-primary">
                Job Applications
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Upload your resume once. We tailor it to every job, write cover
              letters, and even fill out forms – all with one click using Accomplish.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-4 text-lg font-semibold shadow-lg transition-all hover:scale-105"
                >
                  Start Automating
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-28 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  Smart Resume Parsing
                </h3>
                <p className="text-muted-foreground">
                  AI extracts your skills, experience, and education
                  automatically with high precision.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  Smart Job Matching
                </h3>
                <p className="text-muted-foreground">
                  Find relevant jobs from multiple sources, ranked by how well
                  they match your profile.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  One-Click Apply
                </h3>
                <p className="text-muted-foreground">
                  Let AutoApply fill out forms, customize answers, and submit
                  your application in seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>98% application success rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
              <span>50k+ jobs applied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/50"></div>
              <span>4.9/5 user rating</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}