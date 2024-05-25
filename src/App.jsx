import React, { useEffect, useState } from 'react';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch('https://testapi.devtoolsdaily.com/users')
      .then((resp) => {
        return resp.json();
      })
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
    setDisplayedItems((prevItem) => [...prevItem, ...nextItems]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // This means that whenever the user scrolls the window, the handleScroll function will be executed.
    console.log('Adding scroll event listener');
    window.addEventListener('scroll', handleScroll);

    // This is the cleanup function. It is returned from the useEffect hook and will be executed when the component unmounts or when the dependencies specified in the dependency array change
    return () => {
      console.log('Removing scroll event listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <div>
      <h1> Infinite scroll</h1>
      {displayedItems.map((item, index) => (
        <div key={index} style={{ overflow: 'scroll', height: '30px' }}>
          {item.firstName}
        </div>
      ))}

      {loading && <p>Loading..</p>}
      {!hasMore && <p>No more to load..</p>}
    </div>
  );
};

export default App;
