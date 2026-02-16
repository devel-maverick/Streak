import { Marquee } from "@/components/shadcn-space/animations/marquee";

type BrandList = {
  image: string;
  name: string;
};

export default function MarqueeBrandsDemo() {
  const brandList: BrandList[] = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      name: "Google",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      name: "Microsoft",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      name: "Amazon",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      name: "Netflix",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
      name: "PayPal",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
      name: "Tesla",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
      name: "Airbnb",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
      name: "Spotify",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      name: "Stripe",
    },
  ];

  return (
    <>
      <Marquee className="[--duration:20s] p-0" pauseOnHover>
        {brandList.map((brand, index) => (
          <div key={index} className="flex justify-center items-center">
            <img
              src={brand.image}
              alt={brand.name}
              className="w-28 h-8 mr-6 lg:mr-20"
            />
          </div>
        ))}
      </Marquee>
    </>
  );
}
