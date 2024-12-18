import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "./utils";
import Fuse from "fuse.js";

export default function ComboBox({ menus, selected, setSelected }) {
  const [query, setQuery] = useState("");
  const [filteredMenuItems, setFilteredMenuItems] = useState(menus);

  const fuse = new Fuse(menus, {
    keys: ["name", "subText"],
    threshold: 0.3,
  });

  useEffect(() => {
    const results = fuse.search(query);
    const filteredMenuItems =
      query === "" ? menus : results.map((result) => result.item);
    setFilteredMenuItems(filteredMenuItems);
  }, [query, menus]);

  return (
    <Combobox
      as="div"
      value={selected}
      onChange={(event) => {
        setQuery("");
        setSelected(event);
      }}
    >
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(menu) =>
            menu.name && menu.subText
              ? `${menu.name} - ${menu.subText}`
              : "Select Sport"
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredMenuItems.map((menu, idx) => (
            <Combobox.Option
              key={`${menu.subText}-${idx}`}
              value={menu}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <div className="flex">
                    <span
                      className={classNames(
                        selected ? "font-semibold" : "font-normal",
                        "truncate"
                      )}
                    >
                      {menu.name}
                    </span>
                    <span
                      className={classNames(
                        active ? "text-indigo-200" : "text-gray-500",
                        "ml-2 truncate"
                      )}
                    >
                      {menu.subText}
                    </span>
                  </div>

                  {selected && (
                    <span
                      className={classNames(
                        active ? "text-white" : "text-indigo-600",
                        "absolute inset-y-0 right-0 flex items-center pr-4"
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
