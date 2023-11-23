class APIFeatures {
  //ModelFindQuery
  //reqQueryObj =>example url:../?startDate=0&endDate=0&minPrice=100
  constructor(ModelFindQuery, reqQueryObj) {
    this.ModelFindQuery = ModelFindQuery;
    this.reqQueryObj = reqQueryObj;
  }

  searchModel() {
    if (this.reqQueryObj.currentItem) {
      const items = this.reqQueryObj.currentItem.split(',');

      this.ModelFindQuery = this.ModelFindQuery.find({
        $or: [
          {
            name: {
              $regex: new RegExp(this.reqQueryObj.name, 'gi'),
            },
          },
          {
            creator: {
              $regex: new RegExp(this.reqQueryObj.name, 'gi'),
            },
          },
        ],
      });
    }

    //search tag
    if (this.reqQueryObj.tags) {
      //一. 有包含得項目都搜索得當不會篩選
      const tagArr = this.reqQueryObj.tags.split(',');
      // const regexArr = tagArr.map((tag) => {
      //   return { tags: { $regex: new RegExp(tag, 'i') } };
      // });

      // this.ModelFindQuery = this.ModelFindQuery.find({
      //   $or: regexArr,
      // });

      //二. 只搜索有包含在內得項目
      this.ModelFindQuery = this.ModelFindQuery.find({
        tags: { $in: tagArr.map((item) => new RegExp(item, 'i')) },
      });
    }

    if (this.reqQueryObj.isBid) {
      this.ModelFindQuery = this.ModelFindQuery.find({
        isBid: this.reqQueryObj.isBid,
      });
    }

    return this;
  }

  filter() {
    //整理url Query
    const filterQuery = { ...this.reqQueryObj };

    //過濾功能性url Query 物件keyName ('page', 'sort', 'limit', 'fields')
    const excludedField = ['page', 'sort', 'limit', 'fields', 'name'];
    excludedField.forEach((field) => delete filterQuery[field]);

    //將過濾過後得filterQuery物件轉為字串, 並在MongoDB 語法前加上"$" => $gte, $lte..
    let reqQueryObj = JSON.stringify(filterQuery);
    reqQueryObj = reqQueryObj.replace(
      /\b(gte|lte|gt|lt|exists)\b/g,
      (match) => `$${match}`
    );

    this.ModelFindQuery.find(JSON.parse(reqQueryObj));
    return this;
  }

  sort() {
    if (this.reqQueryObj.sort) {
      this.ModelFindQuery = this.ModelFindQuery.sort(
        this.toSpaceString(this.reqQueryObj.sort)
      );
    } else {
      this.ModelFindQuery = this.ModelFindQuery.sort('-createdAt');
    }
    return this;
  }

  toSpaceString(str) {
    //string arr split , insert ' ' space for mongoose select using.
    return str.split(',').join(' ');
  }

  limitField() {
    if (this.reqQueryObj.fields) {
      this.ModelFindQuery = this.ModelFindQuery.select(
        this.toSpaceString(this.reqQueryObj.fields)
      );
    } else {
      //hidden mongoose default version field
      this.ModelFindQuery = this.ModelFindQuery.select('-__v');
    }

    return this;
  }

  //4. pagination
  pagination() {
    const limit = parseInt(this.reqQueryObj.limit, 10) || 100;
    const page = parseInt(this.reqQueryObj.page, 10) || 1;
    const skip = (page - 1) * limit;

    this.ModelFindQuery = this.ModelFindQuery.sort('_id')
      .skip(skip)
      .limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
