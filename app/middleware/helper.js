exports.populateDbQuery = (query, options = {}) => {
    const match = {};
    (options.text || []).forEach((k) => {
      if (query[k]) {
        if (k === "_id") {
          match[k] = { $in: query[k].trim()}
        } else {
          match[k] = { $regex: query[k].trim(), $options: 'i' };
        }
      }
    });
    
    (options.array || []).forEach((k) => {
        if (query[k]) {
          if (k === "_id") {
            match[k] = { $in: query[k].trim()}
          } else {
            match[k] = query[k].trim();
          }
        }
      });
  
    (options.boolean || []).forEach((k) => {
      if (['false', '0'].indexOf(query[k]) > -1) {
        match[k] = false;
      } else if (query[k]) {
        match[k] = true;
      }
    });
  
    (options.equal || []).forEach((k) => {
      if (query[k]) {
        match[k] = query[k];
      }
    });
    return match;
  };
  