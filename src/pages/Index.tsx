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
  }
];

const Index = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-32 pb-96 p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-text text-center mb-4">
            Find Your Connection
          </h1>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            Discover meaningful relationships in your area with our modern approach to dating
          </p>
        </header>
        
        <main className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile, index) => (
              <ProfileCard key={index} {...profile} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Index;