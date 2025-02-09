const beautifySnakeCaseCollection = (items) => {
    return items
      .map((area) =>
        area.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
      )
      .join(", ");
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


  module.exports = { capitalize , beautifySnakeCaseCollection};