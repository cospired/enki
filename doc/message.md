const message =   {
  id: string, // check uniquness
  description: string,
  defaultMessage: string,
  meta: {
    file: src/components/views/home.jsx,
    start: {
      line: 11,
      column: 11
    },
    end: {
      line: 15,
      column: 3
    },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
  },
  translations: {
    [lang]: {
      message: string,
      createdAt: Date,
      updatedAt: Date,
      deletedAt: Date,
      fuzzy: boolean, // defaults to false, set when content of default message changes or by request of user,
      inheritFrom: array<string>, // in order of lookup, if empty, look up uses default strategy: parents, sibling, parent siblings, parent parents, defaultMessage
      whitelist: boolean // if true, this translation is allowed to inherit and not counted as missing if message is not set
    }
  }
}
