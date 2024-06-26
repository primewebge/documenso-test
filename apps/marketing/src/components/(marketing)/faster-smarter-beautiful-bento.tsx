import type { HTMLAttributes } from 'react';

import Image from 'next/image';

import backgroundPattern from '@documenso/assets/images/background-pattern.png';
import cardBeautifulFigure from '@documenso/assets/images/card-beautiful-figure.jpg';
import cardSharingFigure from '@documenso/assets/images/card-sharing-figure.jpeg';
import keepTrackPattern from '@documenso/assets/images/keep-track.png';
import uploadDocumentPatter from '@documenso/assets/images/upload-document.png';
import { cn } from '@documenso/ui/lib/utils';
import { Card, CardContent } from '@documenso/ui/primitives/card';

export type FasterSmarterBeautifulBentoProps = HTMLAttributes<HTMLDivElement>;

export const FasterSmarterBeautifulBento = ({
  className,
  ...props
}: FasterSmarterBeautifulBentoProps) => {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <Image
          src={backgroundPattern}
          alt="background pattern"
          className="h-full scale-125 object-cover dark:contrast-[70%] dark:invert dark:sepia md:scale-150 lg:scale-[175%]"
        />
      </div>
      <h2 className="px-0 text-center text-[22px] font-semibold md:px-12 md:text-4xl lg:px-24">
        სერიოზული კონტრაქტების მარტივად გაფორმება
        {/* <span className="block md:mt-0">უფრო სწრაფი, მარტივი და ლამაზი.</span> */}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-8 md:mt-16">
        {/* <Card className="col-span-2" degrees={45} gradient>
          <CardContent className="grid grid-cols-12 gap-8 overflow-hidden p-6 lg:aspect-[2.5/1]">
            <p className="text-foreground/80 col-span-12 leading-relaxed lg:col-span-6">
              <strong className="block">სწრაფი.</strong>
               When it comes to sending or receiving a contract, you can count on lightning-fast speeds. You can trust that it's really, really fast 
              როდესაც საქმე ეხება ხელშეკრულების გაგზავნას ან მიღებას, you can count on
              lightning-fast speeds.
            </p>

            <div className="col-span-12 -my-6 -mr-6 flex items-end justify-end pt-12 lg:col-span-6">
              <Image
                src={cardFastFigure}
                alt="its fast"
                className="max-w-[80%] dark:contrast-[70%] dark:hue-rotate-180 dark:invert lg:max-w-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">ლამაზი.</strong>
              Because signing should be celebrated. That’s why we care about the smallest detail in
              our product.
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardBeautifulFigure}
                alt="its fast"
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">მარტივი.</strong>
              ჩვენი შაბლონები აღჭურვილია ისეთი თვისებებით, რომლებიც დაგეხმარებათ დაზოგოთ დრო და
              ენერგია.
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardSmartFigure}
                alt="its fast"
                className="w-full max-w-[16rem] dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card> */}

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid h-full grid-cols-1 items-center gap-8 px-6 py-5 md:grid-cols-2">
            <p className="text-foreground/80 pt-4 leading-relaxed md:p-4">
              <strong className="block text-lg" style={{ marginBottom: '0.5rem' }}>
                ატვირთეთ ფაილი
              </strong>
              ერთი დაჭერით ატვირთეთ თქვენი დოკუმენტი, რათა დაიწყოთ უსაფრთხო და შეუფერხებელი
              ხელმოწერა
            </p>

            <div className="flex items-center justify-center py-4 md:p-4">
              <Image
                src={uploadDocumentPatter}
                alt="its fast"
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid h-full grid-cols-1 items-center gap-8 px-6 py-5 md:grid-cols-2">
            <p className="text-foreground/80 pt-4 leading-relaxed md:p-4">
              <strong className="block text-lg" style={{ marginBottom: '0.5rem' }}>
                დაამატეთ ხელმოწერა
              </strong>
              მოხაზეთ ან დაბეჭდეთ თქვენი ხელმოწერა, შეინახეთ თქვენს პროფილში და გამოიყენეთ ის, როცა
              დაგჭირდებათ
            </p>

            <div className="flex items-center justify-center py-4 md:p-4">
              <Image
                src={cardBeautifulFigure}
                alt="its fast"
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid h-full grid-cols-1 items-center gap-8 px-6 py-5 md:grid-cols-2">
            <p className="text-foreground/80 pt-4 leading-relaxed md:p-4">
              <strong className="block text-lg" style={{ marginBottom: '0.5rem' }}>
                გააგზავნეთ
              </strong>
              ავოტმატურად გადაუგზავნეთ დოკუმენტი სხვა ხელმომწერებს მათი ელ.ფოსტის შეყვანით
            </p>

            <div className="flex items-center justify-center py-4 md:p-4">
              <Image
                src={cardSharingFigure}
                alt="its fast"
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid h-full grid-cols-1 items-center gap-8 px-6 py-5 md:grid-cols-2">
            <p className="text-foreground/80 pt-4 leading-relaxed md:p-4">
              <strong className="block text-lg" style={{ marginBottom: '0.5rem' }}>
                თვალი ადევნეთ
              </strong>
              თვალი ადევნეთ თქვენი დოკუმენტის სტატუსს და შეინახეთ უკვე ხელმომწერილი დოკუმენტი
            </p>

            <div className="flex items-center justify-center py-4 md:p-4">
              <Image
                src={keepTrackPattern}
                alt="its fast"
                className="w-full max-w-xs scale-100 dark:contrast-[70%] dark:hue-rotate-180 dark:invert lg:scale-125"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
