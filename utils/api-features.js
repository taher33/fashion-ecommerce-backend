class apiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let newQuery = {
      ...this.queryStr,
    };
    const exclude = ["sort", "page", "limit", "fields"];
    exclude.forEach((el) => delete newQuery[el]);
    this.query = this.query.find(newQuery);
    // if (!newQuery.user && this.user.People_I_follow.length !== 0) {
    //   this.query = this.query.find({ user: this.user.following });
    // }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(".").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(".").join(" ");
      console.log(sortBy);
      console.log("hey");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 9;

    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = apiFeatures;
