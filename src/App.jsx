import React, { useEffect, useState } from 'react';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch('https://testapi.devtoolsdaily.com/users')
      .then((resp) => resp.json())
      .then((data) => {
        setItems(data);
        setDisplayedItems(data.slice(0, 20));
        setHasMore(data.length > 20);
      })
      .catch((error) => {
        console.error('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      if (!loading && hasMore) {
        loadMoreItems();
      }
    }
  };

  const loadMoreItems = () => {
    if (displayedItems.length >= items.length) {
      setHasMore(false);
      return;
    }
    const nextItems = items.slice(
      displayedItems.length,
      displayedItems.length + 20
    );
    setDisplayedItems((prevItems) => [...prevItems, ...nextItems]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Adding scroll event listener');
    window.addEventListener('scroll', handleScroll);

    return () => {
      console.log('Removing scroll event listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <h1> Infinite Scroll</h1>
      {displayedItems.map((item) => (
        <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          {item.firstName}
        </div>
      ))}

      {loading && <p>Loading..</p>}
      {!hasMore && <p>No more to load..</p>}
    </div>
  );
};

export default App;
