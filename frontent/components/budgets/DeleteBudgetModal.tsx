"use client"

import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ConfirmPasswordForm from './ConfirmPasswordForm';

export default function DeleteBudgetModal() {
//   const [show, setShow] = useState(false)
  const router = useRouter()
  const pathname= usePathname()
  const searchParmas= useSearchParams() //get url
  const deleteBudgetId=searchParmas.get('deleteBudgetId')//get url params
  const show = deleteBudgetId ? true : false // it work to show or hide the form
  const hideModal = new URLSearchParams(searchParmas.toString())// get all url
  hideModal.delete('deleteBudgetId')// only delete the params to hide form
  return (
    <>
      <>
        <Transition appear show={show} as={Fragment}>
          {/* when we touch outside the form , we replace the url with the new url without params */}
          <Dialog as="div" className="relative z-10" onClose={() => router.replace(`${pathname}?${hideModal}`)}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                    <ConfirmPasswordForm/>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </>
  )
}