import * as React from "react";
import { Parser } from "html-to-react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch,
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleSelectFacet,
  SingleLinksFacet,
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
// We import custom.css here to override styles defined by the out-ofthe-box stylesheet
// avove
import "./custom.css";

// This is a custom component we've created.
import ClearFilters from "./ClearFilters";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from "./config/config-helper";


const htmlToReactParser = new Parser();
const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
};

const CustomPagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

const CustomResultView = ({ result, onClickLink }) => (
    <div className="searchresult">
      <h2>
        <a onClick={onClickLink} href={result.url.raw}>
          { htmlToReactParser.parse(result.title.snippet) }
        </a>
      </h2>
      <a className="url-display">{result.url.raw}</a> <button>▼</button>
      <p>{ htmlToReactParser.parse(result.body_content.snippet)}</p>
    </div>

  // <li className="sui-result">
  //   <div className="sui-result__header">
  //     <h3>
  //       <a onClick={onClickLink} href={result.url.raw}>
  //         {result.title.snippet}
  //       </a>
  //     </h3>
  //   </div>

  //   <div className="sui-result__body">
  //     <a>{result.url.raw}</a> <button>▼</button>
  //     <p>{result.body_content.snippet}</p>
  //     {/* use 'raw' values of fields to access values without snippets */}
  //     {/* Use the 'snippet' property of fields with dangerouslySetInnerHtml to render snippets */}
  //     <div
  //       className="sui-result__details"
  //       dangerouslySetInnerHTML={{ __html: result.description }}
  //     ></div>
  //   </div>
  // </li>
);

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App customization-example">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      autocompleteResults={{
                        linkTarget: "_blank",
                        sectionTitle: "Results",
                        titleField: "title",
                        urlField: "nps_link",
                        shouldTrackClickThrough: true,
                        clickThroughTags: ["test"],
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={0}
                    />
                  }
                  sideContent={
                    <div>
                      {/* <ClearFilters />
                      <br /> */}
                      {/* <br /> */}
                      {wasSearched && (
                        <Sorting
                          label={"Sort by"}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}
                      {getFacetFields().map((field) => (
                        <Facet key={field} field={field} label={field} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      resultView={CustomResultView}
                      // titleField="title"
                      // urlField="nps_link"
                      // thumbnailField="image_url"
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().thumbnailField}
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <>
                      {wasSearched && (
                        <PagingInfo view={CustomPagingInfoView} />
                      )}
                      {wasSearched && <ResultsPerPage />}
                    </>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
