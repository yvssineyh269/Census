import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import wall from "@/public/wall-bg.jpeg"

export default function Hero() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 className="block text-3xl font-bold text-foreground sm:text-4xl lg:text-6xl lg:leading-tight">Clauser vos ventes avec <span className="bg-clip-text text-transparent bg-primary-gradient">Census App</span> créée par Next Step<sup className="align-super text-[0.6rem] leading-none bg-clip-text text-transparent bg-primary-gradient">TM</sup></h1>
          <p className="mt-3 text-lg text-foreground">Hand-picked professionals and expertly crafted components, designed for any kind of entrepreneur.</p>

          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <Link className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-primary-gradient border border-primary-line text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-50 disabled:pointer-events-none" href="/login">
              Commencer
            </Link>
            <Link className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-layer border border-layer-line text-layer-foreground shadow-2xs hover:bg-layer-hover focus:outline-hidden focus:bg-layer-focus disabled:opacity-50 disabled:pointer-events-none" href="/team">
              Contactez notre équipe de vente
            </Link>
          </div>

          <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
            <div className="py-5">
              <div className="flex gap-x-1">
              </div>
              <p className="mt-3 text-sm text-foreground">
                <span className="font-bold">4.6</span> /5 - from 12k reviews
              </p>
              <div className="mt-5">
                <Star />
              </div>
            </div>
            <div className="py-5">
              <div className="flex gap-x-1">
              </div>
              <p className="mt-3 text-sm text-foreground">
                <span className="font-bold">4.8</span> /5 - from 5k reviews
              </p>
              <div className="mt-5">
              </div>
            </div>
          </div>
        </div>


        <div className="relative ms-4">
          <Image
            className="w-full"
            src={wall}
            alt="Hero Image"
            width={700}
            height={600}
          />
          <div className="absolute inset-0 -z-1 bg-linear-to-tr from-surface-1 via-transparent to-travia-transparent size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6"></div>


          <div className="absolute bottom-0 inset-s-0">
            <svg className="w-2/3 ms-auto h-auto text-white dark:text-neutral-900" width="630" height="451" viewBox="0 0 630 451" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="531" y="352" width="99" height="99" fill="currentColor" />
              <rect x="140" y="352" width="106" height="99" fill="currentColor" />
              <rect x="482" y="402" width="64" height="49" fill="currentColor" />
              <rect x="433" y="402" width="63" height="49" fill="currentColor" />
              <rect x="384" y="352" width="49" height="50" fill="currentColor" />
              <rect x="531" y="328" width="50" height="50" fill="currentColor" />
              <rect x="99" y="303" width="49" height="58" fill="currentColor" />
              <rect x="99" y="352" width="49" height="50" fill="currentColor" />
              <rect x="99" y="392" width="49" height="59" fill="currentColor" />
              <rect x="44" y="402" width="66" height="49" fill="currentColor" />
              <rect x="234" y="402" width="62" height="49" fill="currentColor" />
              <rect x="334" y="303" width="50" height="49" fill="currentColor" />
              <rect x="581" width="49" height="49" fill="currentColor" />
              <rect x="581" width="49" height="64" fill="currentColor" />
              <rect x="482" y="123" width="49" height="49" fill="currentColor" />
              <rect x="507" y="124" width="49" height="24" fill="currentColor" />
              <rect x="531" y="49" width="99" height="99" fill="currentColor" />
            </svg>
          </div>

        </div>

      </div>

    </div>
  )

}




