import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Head from "next/head";
import Link from "next/link";

interface AutopilotResult {
  id: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  score?: number;
  assessment?: {
    score: number;
    reasoning: string;
    criteria_matches?: Array<{
      criteria: string;
      matched: boolean;
    }>;
  };
}

export default function AutopilotDemo() {
  const [customQuery, setCustomQuery] = useState("");
  const [customCriteria, setCustomCriteria] = useState("");
  const [results, setResults] = useState<AutopilotResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    // For demo purposes, we'll skip authentication
    // In production, you would authenticate users here
    addToEventLog("Demo mode - no authentication required");

    // Set up event listeners
    const handleResultClick = (event: any) => {
      addToEventLog(
        `Result clicked: ${event.payload?.result?.name || "Unknown"}`
      );
    };

    const handleComplete = (event: any) => {
      addToEventLog(
        `Autopilot completed with ${
          event.payload?.results?.length || 0
        } results`
      );
    };

    const handleClose = () => {
      addToEventLog("Autopilot modal closed");
    };

    window.Village.on("autopilotResultClick", handleResultClick);
    window.Village.on("autopilotComplete", handleComplete);
    window.Village.on("autopilotClose", handleClose);

    return () => {
      window.Village.off("autopilotResultClick", handleResultClick);
      window.Village.off("autopilotComplete", handleComplete);
      window.Village.off("autopilotClose", handleClose);
    };
  }, []);

  const addToEventLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  const startCustomAutopilot = () => {
    const criteria = customCriteria
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    setIsLoading(true);
    setResults([]);
    addToEventLog(
      `Starting autopilot: "${customQuery}" with ${criteria.length} criteria`
    );

    window.Village.startAutopilot?.({
      initialQuery: customQuery,
      criteria: criteria,
      onResultClick: (result: any) => {
        console.log("Custom result handler:", result);
        // Custom handling - could open a modal, navigate, etc.
        alert(
          `Custom handler: ${
            result?.result?.name || result?.name || "Unknown"
          }\n${result?.result?.current_role || result?.title || ""}`
        );
      },
      onComplete: (data: any) => {
        setIsLoading(false);
        if (data?.results) {
          setResults(data.results);
          addToEventLog(`Received ${data.results.length} results`);
        }
      },
      onClose: () => {
        setIsLoading(false);
        addToEventLog("User closed the autopilot modal");
      },
    });
  };

  const presetSearches = [
    {
      title: "Engineering Leaders",
      query: "VP of Engineering at Series B startups",
      criteria: [
        "10+ years experience",
        "Scaled teams from 10 to 50+",
        "B2B SaaS background",
      ],
    },
    {
      title: "AI/ML Experts",
      query: "Machine learning engineers with LLM experience",
      criteria: [
        "Published research",
        "PyTorch or TensorFlow",
        "Production ML systems",
      ],
    },
    {
      title: "Growth Marketers",
      query: "Head of Growth at consumer apps",
      criteria: [
        "PLG experience",
        "100M+ users scaled",
        "Mobile app marketing",
      ],
    },
    {
      title: "Sales Leaders",
      query: "Enterprise sales directors in cybersecurity",
      criteria: [
        "$10M+ quota achievement",
        "Fortune 500 sales",
        "Team of 20+ reps",
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Autopilot Demo - Village SDK</title>
        <meta
          name="description"
          content="Advanced demo of Village Autopilot AI-powered search and screening"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to main demo
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Village Autopilot Advanced Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore the full capabilities of AI-powered candidate search and
            screening
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Custom Search Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Custom Query Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Autopilot Search</CardTitle>
                  <CardDescription>
                    Build your own search query with custom screening criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Query
                    </label>
                    <Input
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="e.g., Senior product designers in New York"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Screening Criteria (one per line)
                    </label>
                    <Textarea
                      value={customCriteria}
                      onChange={(e) => setCustomCriteria(e.target.value)}
                      placeholder="e.g.\n5+ years experience\nMobile design expertise\nStartup experience"
                      rows={4}
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={startCustomAutopilot}
                    disabled={!customQuery || isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading
                      ? "Running Autopilot..."
                      : "Start Custom Autopilot"}
                  </Button>
                </CardContent>
              </Card>

              {/* Preset Searches */}
              <Card>
                <CardHeader>
                  <CardTitle>Preset Searches</CardTitle>
                  <CardDescription>
                    Try these pre-configured searches to see autopilot in action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {presetSearches.map((preset, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setCustomQuery(preset.query);
                          setCustomCriteria(preset.criteria.join("\n"));
                        }}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            {preset.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">
                            {preset.query}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {preset.criteria.map((criterion, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {criterion}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Results Display */}
              {results.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>
                      Found {results.length} matches for your criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            addToEventLog(`Clicked on result: ${result.name}`);
                            alert(
                              `Result details:\n\nName: ${
                                result.name
                              }\nTitle: ${result.title}\nCompany: ${
                                result.company
                              }\nScore: ${result.score || "N/A"}`
                            );
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{result.name}</h4>
                              <p className="text-sm text-gray-600">
                                {result.title}{" "}
                                {result.company && `at ${result.company}`}
                              </p>
                              {result.location && (
                                <p className="text-sm text-gray-500">
                                  {result.location}
                                </p>
                              )}
                            </div>
                            {result.score && (
                              <Badge className="bg-indigo-100 text-indigo-800">
                                {Math.round(result.score * 100)}% match
                              </Badge>
                            )}
                          </div>
                          {result.assessment && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-700">
                                {result.assessment.reasoning}
                              </p>
                              {result.assessment.criteria_matches && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {result.assessment.criteria_matches.map(
                                    (match, idx) => (
                                      <Badge
                                        key={idx}
                                        variant={
                                          match.matched ? "default" : "outline"
                                        }
                                        className="text-xs"
                                      >
                                        {match.matched ? "✓" : "✗"}{" "}
                                        {match.criteria}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Event Log & Info Panel */}
            <div className="space-y-6">
              {/* Integration Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Integration Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Declarative HTML</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {`<button
  village-module="autopilot"
  village-autopilot-query="Engineers"
  village-autopilot-criteria='["5+ years"]'
>
  Find Engineers
</button>`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">JavaScript API</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {`Village.startAutopilot({
  initialQuery: "Engineers",
  criteria: ["5+ years"],
  onComplete: (data) => {
    console.log(data.results);
  }
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Event Log */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Log</CardTitle>
                  <CardDescription>
                    Real-time events from the autopilot widget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {eventLog.length === 0 ? (
                      <p className="text-sm text-gray-500">No events yet...</p>
                    ) : (
                      eventLog.map((event, index) => (
                        <div
                          key={index}
                          className="text-sm font-mono text-gray-700"
                        >
                          {event}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Autopilot Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>AI-powered natural language search</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Custom screening criteria</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Real-time results with scoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Event callbacks for integration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Programmatic and declarative APIs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Rate limiting and usage tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
