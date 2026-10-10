import { Play } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import Link from 'next/link'

export default function Feature() {
    return (
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="min-h-[35vh] md:min-h-[75vh] bg-[url('/wall-bg.jpeg')] bg-center bg-cover bg-no-repeat relative rounded-xl">
                <div className="absolute bottom-0 inset-s-0 inset-e-0 max-w-xs text-center mx-auto p-6 md:inset-s-auto md:text-start md:mx-0">
                    <Card className="px-5 py-4 inline-block bg-layer rounded-lg md:p-7">
                        <CardContent className="hidden md:block">
                            <h3 className="text-lg font-bold text-layer-foreground sm:text-2xl">How does Preline work?</h3>
                            <p className="mt-2 text-foreground">Learn more about Preline.</p>
                        </CardContent>

                        <div className="md:mt-16">
                            <Link className="flex items-center gap-2 text-sm font-medium text-layer-foreground hover:text-primary-hover focus:outline-hidden focus:text-primary-focus" href="#">
                                <Play /> 
                                Watch our story
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
