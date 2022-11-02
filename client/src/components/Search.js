import axios from "axios";
import React, { useEffect, useState } from "react";

const Search = () => {
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState("");
    const [found, setFound] = useState({});

    const handleChange = async (e) => {
        setSearch(e.target.value);
        // const data = await fetchData(e.target.value);
        // setResults(data)
        // console.log(results);
    };
    useEffect(() => {
        const fetchData = async () => {
            const res = (
                await axios.get(
                    `/api/search?id=${
                        search ? search : ""
                    }`
                )
            ).data;
            setResults(res.data);
        };
        fetchData();
    }, [search]);

    const handleSearch = async (id) => {
        const res = (await axios.get(`/api/search/${id}`))
            .data;
        delete res.data.pk;
        delete res.data.sk;
        setFound(res.data);
    };
    return (
        <div className="container mt-4">
            <div className="col-lg-8 mx-auto">
                <form className="d-flex" role="search">
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search by ID"
                        aria-label="Search"
                        value={search}
                        onChange={handleChange}
                    />
                    {/* <button className="btn btn-outline-success" type="submit">
                        Search
                    </button> */}
                </form>
            </div>
            {/* all search results will be displayed here */}
            <div className="col-lg-8 mx-auto mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results ? (
                            results.map((result) => (
                                <tr key={result.id}>
                                    <td className="">
                                        <h5 className="">{result.id}</h5>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                handleSearch(result.id)
                                            }
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* final result */}
            {found && (
                <div className="">
                    <h1>{found.id}</h1>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Levels</th>
                                <th scope="col">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(found).map(([key, value]) => (
                                <>
                                    {key !== "id" && (
                                        <tr key={key}>
                                            <td className="">
                                                <h5 className="">{key}</h5>
                                            </td>
                                            <td>
                                                <h5 className="">{value}</h5>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Search;
