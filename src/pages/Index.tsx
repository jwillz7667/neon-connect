import React from 'react';
import ProfileCard from '../components/ProfileCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const profiles = [
  {
    name: "Alex",
    age: 28,
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    distance: "2 miles"
  },
  {
    name: "Jordan",
    age: 25,
    location: "Brooklyn, NY",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    distance: "5 miles"
  },
  {
    name: "Sam",
    age: 30,
    location: "Queens, NY",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    distance: "3 miles"
  },
  {
    name: "Taylor",
    age: 27,
    location: "Manhattan, NY",
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    distance: "1 mile"
  },
  {
    name: "Morgan",
    age: 29,
    location: "Bronx, NY",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    distance: "4 miles"
  },
  {
    name: "Casey",
    age: 26,
    location: "Staten Island, NY",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    distance: "6 miles"
  },
  {
    name: "Riley",
    age: 31,
    location: "Jersey City, NJ",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    distance: "3 miles"
  },
  {
    name: "Jamie",
    age: 24,
    location: "Hoboken, NJ",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    distance: "4 miles"
  },
  {
    name: "Drew",
    age: 28,
    location: "Long Island City, NY",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    distance: "2 miles"
  },
  {
    name: "Avery",
    age: 33,
    location: "Astoria, NY",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    distance: "5 miles"
  },
  {
    name: "Quinn",
    age: 29,
    location: "Park Slope, NY",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    distance: "3 miles"
  },
  {
    name: "Parker",
    age: 27,
    location: "Williamsburg, NY",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    distance: "1 mile"
  },
  {
    name: "Blake",
    age: 30,
    location: "Greenwich Village, NY",
    imageUrl: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c",
    distance: "2 miles"
  },
  {
    name: "Charlie",
    age: 26,
    location: "Chelsea, NY",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    distance: "4 miles"
  },
  {
    name: "Skylar",
    age: 32,
    location: "Upper East Side, NY",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    distance: "3 miles"
  },
  {
    name: "Sage",
    age: 28,
    location: "Upper West Side, NY",
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    distance: "5 miles"
  }
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mt-20 px-6 md:px-8">
        <header className="mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-text text-center mb-4">
            Find Your Connection
          </h1>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            Discover meaningful relationships in your area with our modern approach to dating
          </p>
        </header>
        
        <div className="container mx-auto mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {profiles.map((profile, index) => (
              <ProfileCard key={index} {...profile} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;