function Home () {
  return (
    <div>
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Banner */}
        <section className="bg-blue-700 text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Exciting Events</h1>
            <p className="text-lg mb-6">Join conferences, weddings, parties, and workshops near you!</p>
            <Link to="/events" className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200">Explore Events</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;