"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useHeaderStore } from "@/stores/headerStore"
import { useSettingStore } from "@/stores/settingStore"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Heart } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HistoryCard } from "@/components/App"
import { useHistoryStore } from "@/stores/historyStore"

export const runtime = 'edge';
export default function InferenceApiTester() {

    const {
        setUseApp
    } = useHeaderStore()

    const {
        huggingFaceApiKey,
        setHuggingFaceApiKey
    } = useSettingStore()

    const [modelUrl, setModelUrl] = useState<string>("");
    const [tempModelUrl, setTempModelUrl] = useState<string>("");
    const [modelInfo, setModelInfo] = useState<{
        id: string;
        sha: string;
        pipeline_tag: string;
        library_name: string;
        private: boolean;
        _id: string;
        modelId: string;
        disabled: boolean;
        downloads: number;
        likes: number;
        inference: boolean;
    } | null>(null);
    const [prompt, setPrompt] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [outputText, setOutputText] = useState<string>("");
    const [outputImg, setOutputImg] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname()

    const {
        setHistory,
        history
    } = useHistoryStore()

    useEffect(() => {
        setUseApp({
            id: "inference-api-tester",
            name: "Inference API Tester",
        })

        return () => {
            setUseApp(null)
        }
    }, [])

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams as any)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        if (searchParams.has("modelUrl")) {
            setTempModelUrl("https://huggingface.co/" + searchParams.get("modelUrl"))
        }
    }, [searchParams])

    const loadModel = async () => {
        if (tempModelUrl === "") {
            toast({
                title: "Please enter the URL of the model on the Hugging Face",
                description: "Example:https://huggingface.co/gpt2",
            })
            return null
        }

        if (huggingFaceApiKey == "") {
            toast({
                title: "Please enter the Hugging Face API KEY",
            })
            return null
        }

        let url;
        try {
            url = new URL(tempModelUrl)
        } catch (e) {
            toast({
                title: "Please enter the URL of the model on the Hugging Face",
                description: "Example:https://huggingface.co/gpt2",
            })
            return null;
        }


        if ((tempModelUrl.startsWith("https://huggingface.co/") && url.pathname != "/") || tempModelUrl.startsWith("https://api-inference.huggingface.co/models")) {

            const modelApiURL = tempModelUrl.startsWith("https://api-inference.huggingface.co/models") ? tempModelUrl : "https://api-inference.huggingface.co/models" + url.pathname;

            try {
                const modelInfo = (await axios.get(modelApiURL)).data;

                setModelInfo({
                    id: modelInfo.id,
                    sha: modelInfo.sha,
                    pipeline_tag: modelInfo.pipeline_tag,
                    library_name: modelInfo.library_name,
                    private: modelInfo.private,
                    _id: modelInfo._id,
                    modelId: modelInfo.modelId,
                    disabled: modelInfo.disabled,
                    downloads: modelInfo.downloads,
                    likes: modelInfo.likes,
                    inference: modelInfo.cardData && modelInfo.cardData.inference == false ? false : true,
                });
                setModelUrl(modelApiURL);
                router.push(pathname + '?' + createQueryString('modelUrl', modelInfo.modelId))
                setHistory([modelInfo.modelId, ...history.filter((historyItem) => historyItem !== modelInfo.modelId).slice(0, 20)])

            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "Model not found!",
                        description: "Try again.",
                    })
                    return null;
                } else {
                    toast({
                        title: "An error occurred while loading the model.",
                        description: "Try again.",
                    })
                    return null
                }
            }


        } else {
            toast({
                title: "The URL does not seem to be in the correct format",
                description: "Example:https://huggingface.co/gpt2",
            })
        }
    }

    const runTransformers = async () => {
        setOutputText("")
        if (modelUrl && huggingFaceApiKey) {

            if (prompt === "") {
                toast({
                    title: "Please enter the prompt",
                })
                return null
            }

            setLoading(true)


            try {
                const result = await axios.post(modelUrl, { inputs: prompt }, {
                    headers: {
                        Authorization: `Bearer ${huggingFaceApiKey}`,
                        "Content-Type": "application/json"
                    },
                })

                setLoading(false)
                setOutputText(result.data[0].generated_text)
            } catch (error: any) {
                console.log(error)
                setLoading(false)
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "Model not found!",
                        description: "Try again.",
                    })
                    return null;
                } else if (error.response) {
                    if (error.response.status == 400) {
                        toast({
                            title: "API key is invalid.",
                            description: "Try again.",
                        })
                        return null;
                    }
                    toast({
                        title: error.response.status,
                        description: "Try again.",
                    })
                    return null
                } else {
                    toast({
                        title: "An error occurred while loading the model.",
                        description: "Try again.",
                    })
                    return null
                }
            }


        } else {
            toast({
                title: "Please enter model URL and API key",
            })
        }
    }

    const runDiffusers = async () => {
        setOutputText("")
        if (modelUrl && huggingFaceApiKey) {

            if (prompt === "") {
                toast({
                    title: "Please enter the prompt",
                })
                return null
            }

            setLoading(true)


            try {
                const result = await axios.post(modelUrl, { inputs: prompt }, {
                    headers: {
                        Authorization: `Bearer ${huggingFaceApiKey}`,
                        "Content-Type": "application/json"
                    },
                    responseType: "arraybuffer"
                })

                setLoading(false)
                const base64 = Buffer.from(result.data).toString("base64");
                const dataUrl = `data:${result.headers["content-type"]};base64,${base64}`;
                console.log(dataUrl)
                setOutputImg(dataUrl)
            } catch (error: any) {
                console.log(error)
                setLoading(false)
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "Model not found!",
                        description: "Try again.",
                    })
                    return null;
                } else if (error.response) {
                    if (error.response.status == 400) {
                        toast({
                            title: "API key is invalid.",
                            description: "Try again.",
                        })
                        return null;
                    }
                    if (error.response.status == 503) {
                        toast({
                            title: "Loading model...",
                            description: "Please run again in one minute.",
                        })
                        return null;
                    }
                    toast({
                        title: error.response.status,
                        description: "Try again.",
                    })
                    return null
                } else {
                    toast({
                        title: "An error occurred while loading the model.",
                        description: "Try again.",
                    })
                    return null
                }
            }


        } else {
            toast({
                title: "Please enter model URL and API key",
            })
        }
    }

    const clickHistory = async (item: string) => {
        setTempModelUrl("https://huggingface.co/" + item)
        await loadModel()
    }

    return (<>
        <div className="space-y-6 mt-4">
            <div>
                <h3 className="text-2xl font-medium">Inference API Tester</h3>
                <p className="text-sm text-muted-foreground">
                    Playground of the Inference API provided by Hugging Face<br></br>
                    What is Inference API:
                </p>
                <blockquote className="mt-6 border-l-2 pl-6 italic">
                    Test and evaluate, for free, over 80,000 publicly accessible machine learning models, or your own private models, via simple HTTP requests, with fast inference hosted on Hugging Face shared infrastructure.
                </blockquote>
            </div>
            <Separator />
            <div>
                <div className="grid w-full items-center gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="model-url">1. Enter the URL of the model on the Hugging Face</Label>
                        <Input
                            type="url"
                            id="model-url"
                            placeholder="https://huggingface.co/gpt2"
                            value={tempModelUrl}
                            onChange={(e) => setTempModelUrl(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>2. Enter Access Tokens for Hugging Face</Label>
                        <small>All APIs are used only for calling specified services and are managed in the browser. Service developers cannot read them.
                            <a
                                href="https://huggingface.co/settings/tokens"
                                target="_blank"
                                rel="noreferrer"
                            >
                                How to get an Access Tokens for Hugging Face
                            </a>
                        </small>
                        <Input
                            type="text"
                            placeholder="*****************"
                            value={huggingFaceApiKey}
                            onChange={(e) => setHuggingFaceApiKey(e.target.value)}
                        />
                    </div>
                    <div className="gap-2 flex justify-center">
                        <Button
                            onClick={loadModel}
                            className="w-[120px] max-w-full"
                        >
                            3. Load
                        </Button>
                    </div>
                    <div className="grid w-full gap-6 lg:flex mt-4">

                        {modelInfo ? <>
                            <div className="w-full lg:w-1/3 break-all flex flex-wrap gap-4">
                                <div className="w-full max-md:flex-1 max-sm:w-full">
                                    <a
                                        href={
                                            "https://huggingface.co/" + modelInfo.modelId
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-2xl">
                                                    {
                                                        modelInfo.modelId
                                                    }
                                                </CardTitle>
                                                <CardDescription>{
                                                    modelInfo.library_name
                                                }</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-4 flex-wrap">
                                                    <div>
                                                        <span className="text-muted-foreground">Likes:</span>
                                                        <span className="ml-2">{modelInfo.likes}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Downloads:</span>
                                                        <span className="ml-2">{modelInfo.downloads}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Private:</span>
                                                        <span className="ml-2">{modelInfo.private ? "YES" : "NO"}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                </div>
                                <div className="w-full max-md:flex-1 max-sm:w-full">
                                    <HistoryCard onClick={clickHistory} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div>
                                    {
                                        modelInfo.disabled ? <div className="flex items-center gap-2">
                                            <Heart size={16} />
                                            <span>This model is disabled.</span>
                                        </div> : <></>
                                    }
                                </div>
                                {
                                    !modelInfo.inference ? <>
                                        <div className="w-full h-full grid items-center justify-center">
                                            <div className="text-center">
                                                <h3 className="text-xl font-medium">Model not supported</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Inference API has been turned off for this model.
                                                </p>
                                            </div>
                                        </div>
                                    </> : modelInfo.library_name == "transformers" ?
                                        <div className="grid gap-6">
                                            <div>
                                                <Label>4. Enter the prompt</Label>
                                                <Textarea
                                                    placeholder="Enter the prompt"
                                                    value={prompt}
                                                    onChange={(e) => setPrompt(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-center">
                                                <Button
                                                    variant="secondary"
                                                    className="w-[240px] max-w-full"
                                                    disabled={loading}
                                                    onClick={runTransformers}
                                                >
                                                    {loading ? <>
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <div role="status">
                                                                <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                            Running .....
                                                        </div>
                                                    </> : <>5. Run</>}
                                                </Button>
                                            </div>
                                            {outputText ?
                                                <div>
                                                    <Label>6. Output</Label>
                                                    <Textarea
                                                        placeholder="Output"
                                                        readOnly
                                                        rows={outputText.split("\n").length + 2}
                                                        className="border-0"
                                                        value={outputText}
                                                        onChange={(e) => setOutputText(e.target.value)}
                                                    />
                                                </div>
                                                : <></>}
                                        </div>
                                        : modelInfo.library_name == "diffusers" ?
                                            <div className="grid gap-6">
                                                <div>
                                                    <Label>4. Enter the prompt</Label>
                                                    <Textarea
                                                        placeholder="Enter the prompt"
                                                        value={prompt}
                                                        onChange={(e) => setPrompt(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="secondary"
                                                        className="w-[240px] max-w-full"
                                                        disabled={loading}
                                                        onClick={runDiffusers}
                                                    >
                                                        {loading ? <>
                                                            <div className="flex items-center gap-2 justify-center">
                                                                <div role="status">
                                                                    <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                Running .....
                                                            </div>
                                                        </> : <>5. Run</>}
                                                    </Button>
                                                </div>
                                                {outputImg ?
                                                    <div>
                                                        <Label>6. Output</Label>
                                                        <img src={outputImg} className="max-w-full" />
                                                    </div>
                                                    : <></>}
                                            </div>
                                            :
                                            <>
                                                <div className="w-full h-full grid items-center justify-center">
                                                    <div className="text-center">
                                                        <h3 className="text-xl font-medium">Model not supported</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            This model is not supported by this application.<br></br>
                                                            Please see the
                                                            <a
                                                                href="https://huggingface.co/docs/api-inference/quicktour"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="ml-1 underline"
                                                            >
                                                                documentation
                                                            </a>
                                                            {" "}
                                                            to see if you can move it with the Inference API
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                }
                            </div>
                        </> : <>
                            <div className="w-full md:w-1/2 lg:w-1/3">
                                <HistoryCard onClick={clickHistory} />
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    </>)
}