import { useEffect, useState } from 'react';
import { AnchorAPI } from '../../../../../modules/AnchorAPI';
import { ProductForListenerSupport } from '../../../../../modules/AnchorAPI/products/fetchProductsForListenerSupport';
import mapProductsToSupportOptions from '../../../modules/mapProductsToSupportOptions';

type SupportOption = {
  id: string;
  amount: number;
  name: string;
  isChosen: boolean;
};

export function useListenerSupportOptions({
  isShowing,
  chosenProductId,
  onSelectPerMonthSupportOptionsChoice,
}: {
  isShowing: boolean;
  chosenProductId: string | null;
  onSelectPerMonthSupportOptionsChoice: (
    newSelectedOption: string,
    supportOption: SupportOption
  ) => void;
}) {
  const [products, setProducts] = useState<ProductForListenerSupport[] | null>(
    null
  );
  const [supportOptions, setSupportOptions] = useState<SupportOption[]>([]);

  /**
   * fetch products when modal is visible
   */
  useEffect(() => {
    if (isShowing) {
      AnchorAPI.fetchProductsForListenerSupport().then(
        ({ products: newProducts }) => {
          setProducts(newProducts);
        }
      );
    }
  }, [isShowing]);

  /**
   * create supportOptions object once products are fetched
   */
  useEffect(() => {
    if (products !== null) {
      setSupportOptions(mapProductsToSupportOptions(products, chosenProductId));
    }
  }, [products, chosenProductId]);

  /**
   * select default option when supportOptions are set
   */
  useEffect(() => {
    if (supportOptions.length > 0 && chosenProductId === null) {
      const defaultChoice =
        supportOptions[Math.floor(supportOptions.length / 2)];
      if (defaultChoice) {
        onSelectPerMonthSupportOptionsChoice(defaultChoice.id, defaultChoice);
      }
    }
  }, [supportOptions, chosenProductId, onSelectPerMonthSupportOptionsChoice]);

  return { supportOptions };
}
