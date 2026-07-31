import React, { useEffect, useState } from "react";
import { bundlesApi } from "../../api/bundles.api";
import BundleCard from "../../components/product/BundleCard";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";

const Bundles = () => {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bundlesApi.getBundles({ limit: 20 }).then(({ data }) => setBundles(data.data)).catch(() => setBundles([])).finally(() => setLoading(false));
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="mb-2 font-display text-2xl font-bold text-navy-900">Bundle Deals</h1>
            <p className="mb-8 text-sm text-navy-500">Save more when you buy these product combinations together.</p>

            {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />)}
                </div>
            ) : !bundles.length ? (
                <EmptyState title="No bundles available right now" description="Check back soon for deals." />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {bundles.map((b) => <BundleCard key={b._id} bundle={b} />)}
                </div>
            )}
        </div>
    );
};

export default Bundles;