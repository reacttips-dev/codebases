import {useState, useEffect} from "react";
import ProductFinderOptions from "../ProductFinderOptions";
import ProductFinderOptionsBuilder from "../ProductFinderOptionsBuilder";
import {HttpRequestType} from "errors";
import fetch from "../../../utils/fetch";

function useFetch(url: string): [boolean, ProductFinderOptions, Error, object | undefined] {
    const [options, setOptions] = useState<ProductFinderOptions | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();
    const [rawOptions, setRawOptions] = useState<object>();

    const fetchVariants = async () => {
        setLoading(true);
        try {
            const response = await fetch(url, HttpRequestType.ProductVariantsApi);
            if (response.ok) {
                const variantsJson = await response.json();

                setRawOptions(variantsJson);
                setOptions(
                    new ProductFinderOptions(
                        new ProductFinderOptionsBuilder().build(variantsJson, [
                            "carrier",
                            "model",
                            "capacity",
                            "color",
                        ]),
                    ),
                );
            } else {
                setLoading(false);
                setError(
                    new Error(`Error has occured while requesting for variants options: ${JSON.stringify(response)}`),
                );
            }
        } catch (error) {
            setLoading(false);
            setError(new Error(`Error has occured while processing variant options: ${JSON.stringify(error)}`));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVariants();
    }, []);

    return [loading, options, error, rawOptions];
}

export default useFetch;
